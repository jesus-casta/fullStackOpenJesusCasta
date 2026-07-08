import { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    if (!capital || !apiKey) {
      return
    }

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
      )
      .then((response) => {
        setWeather({ capital, data: response.data, error: null })
      })
      .catch(() => {
        setWeather({
          capital,
          data: null,
          error: 'Weather data is not available'
        })
      })
  }, [capital, apiKey])

  if (!apiKey) {
    return (
      <p>
        Set VITE_OPENWEATHER_API_KEY and restart the dev server to show weather.
      </p>
    )
  }

  if (!weather || weather.capital !== capital) {
    return <p>Loading weather...</p>
  }

  if (weather.error) {
    return <p>{weather.error}</p>
  }

  const weatherData = weather.data
  const icon = weatherData.weather[0].icon

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {weatherData.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={weatherData.weather[0].description}
      />
      <p>wind {weatherData.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetails = ({ country }) => {
  const capital = country.capital?.[0]
  const languages = Object.values(country.languages ?? {})

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {capital}</p>
      <p>area {country.area}</p>

      <h2>languages</h2>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        className="flag"
        src={country.flags.png}
        alt={country.flags.alt ?? `Flag of ${country.name.common}`}
      />

      <Weather capital={capital} />
    </div>
  )
}

const Countries = ({ countries, search, onShowCountry }) => {
  if (search.trim() === '') {
    return null
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <div>
        {countries.map((country) => (
          <p key={country.cca3}>
            {country.name.common}{' '}
            <button onClick={() => onShowCountry(country)}>show</button>
          </p>
        ))}
      </div>
    )
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return <p>No matches found</p>
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  const countriesToShow = selectedCountry
    ? [selectedCountry]
    : countries.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />
      <Countries
        countries={countriesToShow}
        search={search}
        onShowCountry={handleShowCountry}
      />
    </div>
  )
}

export default App
