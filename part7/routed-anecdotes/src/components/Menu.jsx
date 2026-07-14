import { Link } from 'react-router-dom'

const Menu = () => {
  return (
    <div className="menu">
      <Link to="/">anecdotes</Link>
      <Link to="/create">create new</Link>
      <Link to="/about">about</Link>
    </div>
  )
}

export default Menu
