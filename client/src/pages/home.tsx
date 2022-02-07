import type { NextPage } from 'next'
import withAuth          from '../utils/withAuth'

const Home: NextPage = () => {
  return (
    <div className='center'>
      <h1>Добро пожаловать!</h1>
      <h3>Здесь собраны лучшие треки!</h3>
    </div>
  )
}

export default withAuth(Home)
