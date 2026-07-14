import { Link, useParams } from 'react-router-dom'
import { useAnecdotes } from '../hooks'

const Anecdote = () => {
  const { id } = useParams()
  const { anecdotes } = useAnecdotes()
  const anecdote = anecdotes.find((item) => item.id === id)

  if (!anecdote) {
    return (
      <div>
        <h2>Anecdote not found</h2>
        <Link to="/">back</Link>
      </div>
    )
  }

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>
        for more info see <a href={anecdote.info}>{anecdote.info}</a>
      </div>
      <div>author: {anecdote.author}</div>
    </div>
  )
}

export default Anecdote
