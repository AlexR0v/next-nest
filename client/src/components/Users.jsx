import { useEffect, useState }      from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiPrivate }               from '../api/index.js'
import useRefreshToken              from '../hooks/useRefreshToken.jsx'

const Users = () => {

  const [users, setUsers] = useState([])
  const refresh = useRefreshToken()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getUsers = async () => {
      try {
        const res = await apiPrivate.get('/auth/users', {
          signal: controller.signal
        })
        isMounted && setUsers(res.data)
      } catch (e) {
        if (e?.response?.status === 403) {
          refresh()
        }
        if (e?.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('username')
          navigate('/login', { state: { from: location }, replace: true })
        }
      }
    }
    getUsers()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  return (
    <article>
      <h2>Users List</h2>
      {users?.length
        ? (
          <ul>
            {users.map((user, i) => <li key={i}>{user?.username}</li>)}
          </ul>
        ) : <p>No users to display</p>
      }
    </article>
  )
}

export default Users

