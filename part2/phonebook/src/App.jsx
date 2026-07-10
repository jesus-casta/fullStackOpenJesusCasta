import { useEffect, useState } from 'react'
import personsService from './services/persons'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      const confirmed = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (!confirmed) {
        return
      }

      const changedPerson = { ...existingPerson, number: newNumber }

      personsService
        .update(existingPerson.id, changedPerson)
        .then((returnedPerson) => {
          setPersons(persons.map((person) =>
            person.id === existingPerson.id ? returnedPerson : person
          ))
          showNotification(`Changed ${returnedPerson.name}`, 'success')
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          if (error.response?.data?.error) {
            showNotification(error.response.data.error, 'error')
          } else {
            showNotification(`Information of ${existingPerson.name} has already been removed from server`, 'error')
            setPersons(persons.filter((person) => person.id !== existingPerson.id))
          }
        })
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personsService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name}`, 'success')
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        showNotification(error.response?.data?.error || 'Adding person failed', 'error')
      })
  }

  const deletePerson = (id, name) => {
    const confirmed = window.confirm(`Delete ${name}?`)

    if (!confirmed) {
      return
    }

    personsService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id))
      })
      .catch(() => {
        showNotification(`Information of ${name} has already been removed from server`, 'error')
        setPersons(persons.filter((person) => person.id !== id))
      })
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
