const baseUrl = 'http://localhost:3001/anecdotes'

const handleResponse = async (response, message) => {
  if (!response.ok) {
    throw new Error(message)
  }

  return await response.json()
}

const getAll = async () => {
  const response = await fetch(baseUrl)
  return await handleResponse(response, 'getting anecdotes failed')
}

const create = async (anecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...anecdote, votes: 0 }),
  })

  return await handleResponse(response, 'creating anecdote failed')
}

const remove = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('removing anecdote failed')
  }
}

export default { getAll, create, remove }
