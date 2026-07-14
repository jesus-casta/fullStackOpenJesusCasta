const baseUrl = 'http://localhost:3001/anecdotes'

const checkResponse = async (response, errorMessage) => {
  if (!response.ok) {
    throw new Error(errorMessage)
  }

  return await response.json()
}

const getAll = async () => {
  const response = await fetch(baseUrl)
  return await checkResponse(response, 'Failed to fetch anecdotes')
}

const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })

  return await checkResponse(response, 'Failed to create anecdote')
}

const updateVotes = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })

  return await checkResponse(response, 'Failed to vote anecdote')
}

export default { getAll, createNew, updateVotes }
