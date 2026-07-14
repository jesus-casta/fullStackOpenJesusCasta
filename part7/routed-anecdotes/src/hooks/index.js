import { useEffect, useState } from 'react'
import { create } from 'zustand'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    input: {
      type,
      value,
      onChange,
    },
    value,
    reset,
  }
}

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  loaded: false,

  loadAnecdotes: async () => {
    if (get().loaded) {
      return
    }

    const anecdotes = await anecdoteService.getAll()
    set({ anecdotes, loaded: true })
  },

  addAnecdote: async (anecdote) => {
    const savedAnecdote = await anecdoteService.create(anecdote)
    set((state) => ({
      anecdotes: state.anecdotes.concat(savedAnecdote),
    }))
  },

  deleteAnecdote: async (id) => {
    await anecdoteService.remove(id)
    set((state) => ({
      anecdotes: state.anecdotes.filter((anecdote) => anecdote.id !== id),
    }))
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const loadAnecdotes = useAnecdoteStore((state) => state.loadAnecdotes)
  const addAnecdote = useAnecdoteStore((state) => state.addAnecdote)
  const deleteAnecdote = useAnecdoteStore((state) => state.deleteAnecdote)

  useEffect(() => {
    loadAnecdotes()
  }, [loadAnecdotes])

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote,
  }
}
