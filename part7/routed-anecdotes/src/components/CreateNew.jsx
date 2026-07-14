import { useNavigate } from 'react-router-dom'
import { useAnecdotes, useField } from '../hooks'

const CreateNew = () => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const { addAnecdote } = useAnecdotes()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
    })

    content.reset()
    author.reset()
    info.reset()
    navigate('/')
  }

  const resetForm = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.input} />
        </div>
        <div>
          author
          <input {...author.input} />
        </div>
        <div>
          url for more info
          <input {...info.input} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={resetForm}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
