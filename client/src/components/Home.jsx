import axios                 from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const logout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    await axios.get('http://localhost:5002/api/auth/logout')
    navigate('/login')
  }

  return (
    <section>
      <h1>Home</h1>
      <br />
      <p>You are logged in!</p>
      <br />
      <Link to='/editor'>Go to the Editor page</Link>
      <br />
      <Link to='/admin'>Go to the Admin page</Link>
      <br />
      <Link to='/lounge'>Go to the Lounge</Link>
      <br />
      <Link to='/linkpage'>Go to the link page</Link>
      <div className='flexGrow'>
        <button onClick={logout}>Sign Out</button>
      </div>
    </section>
  )
}

export default Home
