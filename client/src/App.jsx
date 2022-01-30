import { useContext } from 'react'
import Login          from './components/Login.jsx'
import AuthContext    from './context/AuthContext.jsx'

function App () {
  const { auth } = useContext(AuthContext)
  console.log(auth)
  return (
    <main className='App'>
      {/*<Register />*/}
      <Login />
    </main>
  )
}

export default App
