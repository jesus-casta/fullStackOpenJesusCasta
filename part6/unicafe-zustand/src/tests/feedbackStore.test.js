import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import { initialState, reduceFeedback } from '../stores/feedbackStore'

describe('unicafe zustand store reducer helper', () => {
  test('returns initial state when state is undefined', () => {
    const action = { type: 'DO_NOTHING' }
    const newState = reduceFeedback(undefined, action)

    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const state = initialState
    deepFreeze(state)

    const newState = reduceFeedback(state, { type: 'GOOD' })

    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0,
    })
  })

  test('ok is incremented', () => {
    const state = initialState
    deepFreeze(state)

    const newState = reduceFeedback(state, { type: 'OK' })

    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0,
    })
  })

  test('bad is incremented', () => {
    const state = initialState
    deepFreeze(state)

    const newState = reduceFeedback(state, { type: 'BAD' })

    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1,
    })
  })

  test('reset cleans all feedback counters', () => {
    const state = {
      good: 3,
      ok: 2,
      bad: 1,
    }
    deepFreeze(state)

    const newState = reduceFeedback(state, { type: 'RESET' })

    expect(newState).toEqual(initialState)
  })
})
