import { useEffect, useRef, useState }    from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api }                            from '../api/index.js'

const LOGIN_URL = '/auth/login'

const Login = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const userRef = useRef()
  const errRef = useRef()

  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [typePass, setTypePass] = useState('password')
  const [check, setCheck] = useState(false)

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post(LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      const accessToken = response?.data?.access_token
      localStorage.setItem('token', accessToken)
      localStorage.setItem('username', response?.data?.username)
      setUser('')
      setPwd('')
      setSuccess(true)
      navigate(from, { replace: true })
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password')
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg('Login Failed')
      }
      errRef.current.focus()
    }
  }

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <Link to='/'>Go to Home</Link>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live='assertive'
          >{errMsg}</p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='username'
              ref={userRef}
              autoComplete='off'
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />

            <label htmlFor='password'>Password:</label>
            <input
              type={typePass}
              id='password'
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <label htmlFor='checkbox'>Show password:</label>
            <input
              type='checkbox'
              id='checkbox'
              onChange={(e) => {
                setCheck(e.target.checked)
                if (e.target.checked) {
                  setTypePass('text')
                } else setTypePass('password')
              }}
              checked={check}
            />
            <button>Sign In</button>
          </form>
          <p>
            Need an Account?<br />
            <span className='line'>
              <Link to='/register'>Sign Up</Link>
            </span>
          </p>
        </section>
      )}
    </>
  )
}

export default Login

