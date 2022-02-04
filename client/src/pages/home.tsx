import type { NextPage }          from 'next'
import { useGetAllUsersMutation } from '../api/services/auth.service'
import withAuth                   from '../utils/withAuth'

const Home: NextPage = () => {

  const [getUsers] = useGetAllUsersMutation()

  const hendleGetUsers = async () => {
    try {
      const users = await getUsers('').unwrap()
      console.log(users)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      Home
      <button onClick={hendleGetUsers}>Get Users</button>
    </div>
  )
}

export default withAuth(Home)
