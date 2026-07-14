import { create } from 'zustand'

export const initialState = {
  good: 0,
  ok: 0,
  bad: 0,
}

export const reduceFeedback = (state = initialState, action) => {
  switch (action.type) {
    case 'GOOD':
      return { ...state, good: state.good + 1 }
    case 'OK':
      return { ...state, ok: state.ok + 1 }
    case 'BAD':
      return { ...state, bad: state.bad + 1 }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const dispatch = (set) => (action) => set((state) => reduceFeedback(state, action))

const useFeedbackStore = create((set) => ({
  ...initialState,
  dispatch: dispatch(set),
  goodFeedback: () => set((state) => reduceFeedback(state, { type: 'GOOD' })),
  okFeedback: () => set((state) => reduceFeedback(state, { type: 'OK' })),
  badFeedback: () => set((state) => reduceFeedback(state, { type: 'BAD' })),
  resetFeedback: () => set(() => initialState),
}))

export default useFeedbackStore
