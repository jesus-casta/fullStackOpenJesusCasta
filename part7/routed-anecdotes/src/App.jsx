import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import About from './components/About'
import Anecdote from './components/Anecdote'
import AnecdoteList from './components/AnecdoteList'
import CreateNew from './components/CreateNew'
import Footer from './components/Footer'
import Menu from './components/Menu'

const App = () => {
  return (
    <Router>
      <div className="container">
        <h1>Software anecdotes</h1>
        <Menu />
        <Routes>
          <Route path="/" element={<AnecdoteList />} />
          <Route path="/anecdotes/:id" element={<Anecdote />} />
          <Route path="/create" element={<CreateNew />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
