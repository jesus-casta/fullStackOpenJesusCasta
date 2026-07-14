import useFeedbackStore from './stores/feedbackStore'

const App = () => {
  const good = useFeedbackStore((state) => state.good)
  const ok = useFeedbackStore((state) => state.ok)
  const bad = useFeedbackStore((state) => state.bad)
  const goodFeedback = useFeedbackStore((state) => state.goodFeedback)
  const okFeedback = useFeedbackStore((state) => state.okFeedback)
  const badFeedback = useFeedbackStore((state) => state.badFeedback)
  const resetFeedback = useFeedbackStore((state) => state.resetFeedback)

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={goodFeedback}>good</button>
      <button onClick={okFeedback}>ok</button>
      <button onClick={badFeedback}>bad</button>
      <button onClick={resetFeedback}>reset</button>

      <h2>statistics</h2>
      <div>good {good}</div>
      <div>ok {ok}</div>
      <div>bad {bad}</div>
    </div>
  )
}

export default App
