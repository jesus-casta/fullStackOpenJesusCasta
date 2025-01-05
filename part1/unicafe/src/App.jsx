import { useState } from 'react'

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive]= useState(0)




  const increaseGood = () => {
    setGood(good + 1)
    const newGood=good+1
    calculateAveragePositive([newGood,neutral,bad])
  }
  
  const increaseNeutral = () => {
    setNeutral(neutral + 1)
    const newNeutral=neutral+1
    calculateAveragePositive([good,newNeutral,bad])
  }
  const increaseBad = () => {
    setBad (bad+ 1)
    const newBad=bad+1
    calculateAveragePositive([good,neutral,newBad])
  
  }
  const calculateAveragePositive = (props) => {
    console.log(props[0],props[1],props[2])
    const total=props[0]+props[1]+props[2]
    const sum=props[0]*1.0+props[2]*(-1.0)
    console.log(sum,total,sum/total)

    setAverage(sum/total)
    setPositive(props[0]/(props[0]+props[1]+props[2])*100)
  }



  const StatiticLine =({text,value}) =>{
    return (
      <tr><td>{text}</td><td>{value}</td></tr>
    )
  }



  const Statistics = ({ good, neutral, bad, average, positive }) => {
    if (good+neutral+bad === 0) {
      return <p>No feedback given yet.</p>;
    }
  
    return (
      <table>
        <tbody>
          <StatiticLine text="good" value={good} />
          <StatiticLine text="neutral" value={neutral} />
          <StatiticLine text="bad" value={bad} />
          <StatiticLine text="average" value={average.toFixed(3)} />
          <StatiticLine text="positive" value="{positive.toFixed(2)}%" />
        </tbody>
      </table>
    );
  };
  
  

  return (
    <div>
      <h1> give feddback</h1>
      <button onClick={increaseGood}>good</button>
      <button onClick={increaseNeutral}>neutral</button>
      <button onClick={increaseBad}>bad</button>
      <Statistics good={good}  neutral={neutral} bad={bad} average ={average} positive={positive} />
      
      
    </div>
  )
}

export default App