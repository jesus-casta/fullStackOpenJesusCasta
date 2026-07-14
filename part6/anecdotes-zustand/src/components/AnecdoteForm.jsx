import useAnecdoteStore from '../stores/anecdoteStore'

const AnecdoteForm = () => {
  const createAnecdote = useAnecdoteStore((state) => state.createAnecdote)

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    await createAnecdote(content)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
