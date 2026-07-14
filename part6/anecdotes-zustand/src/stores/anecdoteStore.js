import { create } from 'zustand'
import anecdoteService from '../services/anecdotes'

const sortByVotes = (anecdotes) => {
  return [...anecdotes].sort((a, b) => b.votes - a.votes)
}

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  notification: '',
  notificationTimer: null,

  initializeAnecdotes: async () => {
    const anecdotes = await anecdoteService.getAll()
    set({ anecdotes: sortByVotes(anecdotes) })
  },

  createAnecdote: async (content) => {
    const savedAnecdote = await anecdoteService.createNew(content)
    set((state) => ({
      anecdotes: sortByVotes(state.anecdotes.concat(savedAnecdote)),
    }))
    get().setNotification(`new anecdote '${content}'`, 5)
  },

  voteAnecdote: async (anecdote) => {
    const anecdoteWithVotes = {
      ...anecdote,
      votes: anecdote.votes + 1,
    }

    const updatedAnecdote = await anecdoteService.updateVotes(anecdoteWithVotes)

    set((state) => ({
      anecdotes: sortByVotes(
        state.anecdotes.map((oldAnecdote) =>
          oldAnecdote.id !== updatedAnecdote.id ? oldAnecdote : updatedAnecdote
        )
      ),
    }))

    get().setNotification(`you voted '${updatedAnecdote.content}'`, 10)
  },

  setFilter: (filter) => {
    set({ filter })
  },

  setNotification: (message, seconds) => {
    const oldTimer = get().notificationTimer

    if (oldTimer) {
      clearTimeout(oldTimer)
    }

    const newTimer = setTimeout(() => {
      set({ notification: '', notificationTimer: null })
    }, seconds * 1000)

    set({ notification: message, notificationTimer: newTimer })
  },
}))

export default useAnecdoteStore
