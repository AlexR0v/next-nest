import type { NextPage }          from 'next'
import { useState }               from 'react'
import { useGetAllUsersMutation } from '../api/services/auth.service'
import { InitialStateInterface }  from '../store/user.slice'
import withAuth                   from '../utils/withAuth'

const Home: NextPage = () => {

  const [users, setUsers] = useState<InitialStateInterface[]>([])

  const [getUsers] = useGetAllUsersMutation()

  const hendleGetUsers = async () => {
    try {
      const users = await getUsers('').unwrap()
      setUsers(users)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      Home
      <ul>
        {
          users.map(user => (
            <li key={user.id}>
              {user.username}
              isActivated: {user.isActivate}
            </li>
          ))
        }
      </ul>
      <button onClick={hendleGetUsers}>Get Users</button>
    </div>
  )
}

export default withAuth(Home)
