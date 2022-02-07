import Link                                   from 'next/link'
import { useRouter }                          from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useLoginMutation }                   from '../api/services/auth.service'
import { useAppDispatch }                     from '../hooks/store'
import { authUser }                           from '../store/user.slice'

const Login = () => {
  const navigate = useRouter()
  const dispatch = useAppDispatch()

  const [login, { isLoading }] = useLoginMutation()

  const emailRef = useRef<HTMLInputElement>(null)
  const errRef = useRef<HTMLInputElement>(null)

  const [persist, setPersist] = useState(false)

  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const [type, setType] = useState('password')
  const [checkType, setCheckType] = useState(false)

  useEffect(() => {
    if (null !== emailRef.current) {
      emailRef.current.focus()
    }
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [email, pwd])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = await login({ email, password: pwd }).unwrap()
      if (user) {
        dispatch(authUser(user))
        setEmail('')
        setPwd('')
        await navigate.push('/home')
      }
    } catch (err) {
      if (err && err.status === 400) {
        setErrMsg('Ошибка в email и/или пароле')
      } else if (err && err.status === 401) {
        setErrMsg('Неавторизован')
      } else {
        setErrMsg('Login Failed')
      }
      if (null !== errRef.current) {
        errRef.current.focus()
      }
    }
  }

  useEffect(() => {
    localStorage.setItem('persist', String(persist))
  }, [persist])

  useEffect(() => {
    localStorage.setItem('persist', String(false))
  }, [])

  return (

    <section>
      <p
        ref={errRef}
        className={errMsg ? 'errmsg' : 'offscreen'}
        aria-live='assertive'
      >{errMsg}</p>
      <h1>Войти</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Email:</label>
        <input
          className='input'
          type='text'
          id='username'
          ref={emailRef}
          autoComplete='off'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <label htmlFor='password'>Пароль:</label>
        <input
          className='input'
          type={type}
          id='password'
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <div className='persistCheck'>
          <input
            id='typePass'
            className='checkbox'
            type='checkbox'
            checked={checkType}
            onChange={e => {
              setCheckType(e.target.checked)
              if (e.target.checked) {
                setType('text')
              } else {
                setType('password')
              }
            }}
          />
          <label htmlFor='typePass'>Показать пароль</label>
        </div>
        <div className='persistCheck'>
          <input
            className='checkbox'
            type='checkbox'
            id='persist'
            onChange={e => setPersist(e.target.checked)}
            checked={persist}
          />
          <label htmlFor='persist'>Запомнить меня</label>
        </div>
        <button disabled={isLoading}>Войти</button>
      </form>
      <p>
        Нет аккаунта?<br />
        <span className='line'>
                    <Link href='/register'>
                      <a>Зарегистрироваться</a>
                    </Link>
                </span>
      </p>
    </section>

  )
}

export default Login
