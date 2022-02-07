import { faCheck, faInfoCircle, faTimes }     from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon }                    from '@fortawesome/react-fontawesome'
import Link                                   from 'next/link'
import { useRouter }                          from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useRegisterMutation }                from '../api/services/auth.service'

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
const USERNAME_REGEX = /^[a-zA-Z0-9]{2,40}$/i
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

const Register = () => {

  const navigate = useRouter()

  const emailRef = useRef<HTMLInputElement>(null)
  const usernameRef = useRef<HTMLInputElement>(null)
  const errRef = useRef<HTMLInputElement>(null)

  const [type, setType] = useState('password')
  const [checkType, setCheckType] = useState(false)

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [userFocus, setUserFocus] = useState(false)

  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [userNameFocus, setUserNameFocus] = useState(false)

  const [pwd, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)

  const [matchPwd, setMatchPwd] = useState('')
  const [validMatch, setValidMatch] = useState(false)
  const [matchFocus, setMatchFocus] = useState(false)

  const [errMsg, setErrMsg] = useState('')

  const [register, { isLoading }] = useRegisterMutation()

  useEffect(() => {
    if (null !== emailRef.current) {
      emailRef.current.focus()
    }
  }, [])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email))
  }, [email])

  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd))
    setValidMatch(pwd === matchPwd)
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('')
  }, [email, pwd, matchPwd, username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(email)
    const v2 = PWD_REGEX.test(pwd)
    const v3 = USERNAME_REGEX.test(username)
    if (!v1 || !v2 || !v3) {
      setErrMsg('Неправильный ввод')
      return
    }
    try {
      const { success } = await register({ username, email, password: pwd }).unwrap()
      if (success) {
        setEmail('')
        setUsername('')
        setPwd('')
        setMatchPwd('')
        await navigate.push('/confirmed')
      }
    } catch (err) {
      if (err && err.status === 409) {
        setErrMsg('Пользователь уже существует')
      } else if (err) {
        setErrMsg('No Server Response')
      }
      if (null !== errRef.current) {
        errRef.current.focus()
      }
    }
  }

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? 'errmsg' : 'offscreen'}
        aria-live='assertive'
      >{errMsg}</p>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>
          Email:
          <FontAwesomeIcon
            icon={faCheck}
            className={validEmail ? 'valid' : 'hide'}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validEmail || !email ? 'hide' : 'invalid'}
          />
        </label>
        <input
          className='input'
          type='text'
          id='email'
          ref={emailRef}
          autoComplete='off'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          aria-invalid={validEmail ? 'false' : 'true'}
          aria-describedby='uidnote'
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
        />
        <p
          id='uidnote'
          className={userFocus && email && !validEmail ? 'instructions' : 'offscreen'}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Это поле должно быть email
        </p>

        <label htmlFor='username'>
          Имя:
          <FontAwesomeIcon
            icon={faCheck}
            className={validUsername ? 'valid' : 'hide'}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validUsername || !username ? 'hide' : 'invalid'}
          />
        </label>
        <input
          className='input'
          type='text'
          id='username'
          ref={usernameRef}
          autoComplete='off'
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
          aria-invalid={validUsername ? 'false' : 'true'}
          aria-describedby='uidnote'
          onFocus={() => setUserNameFocus(true)}
          onBlur={() => setUserNameFocus(false)}
        />
        <p
          id='uidnote'
          className={userNameFocus && username && !validUsername ? 'instructions' : 'offscreen'}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Это поле должно быть не короче 2-х символов<br />
          Оно не должно содержать спец. символы
        </p>

        <label htmlFor='password'>
          Пароль:
          <FontAwesomeIcon
            icon={faCheck}
            className={validPwd ? 'valid' : 'hide'}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validPwd || !pwd ? 'hide' : 'invalid'}
          />
        </label>
        <input
          className='input'
          type={type}
          id='password'
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
          aria-invalid={validPwd ? 'false' : 'true'}
          aria-describedby='pwdnote'
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />
        <p
          id='pwdnote'
          className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          от 8 до 24 символов.<br />
          Должно содержать буквы в верхнем и нижнем регистре, число и спец. символ<br />
          Допустимые спец. символы: <span aria-label='exclamation mark'>!</span>
          <span aria-label='at symbol'>@</span> <span aria-label='hashtag'>#</span>
          <span aria-label='dollar sign'>$</span> <span aria-label='percent'>%</span>
        </p>


        <label htmlFor='confirm_pwd'>
          Подтвердите пароль:
          <FontAwesomeIcon
            icon={faCheck}
            className={validMatch && matchPwd ? 'valid' : 'hide'}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validMatch || !matchPwd ? 'hide' : 'invalid'}
          />
        </label>
        <input
          className='input'
          type={type}
          id='confirm_pwd'
          onChange={(e) => setMatchPwd(e.target.value)}
          value={matchPwd}
          required
          aria-invalid={validMatch ? 'false' : 'true'}
          aria-describedby='confirmnote'
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />
        <p
          id='confirmnote'
          className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Поле должно совпадать с полем пароль.
        </p>
        <label htmlFor='typePass'>Показать пароль</label>
        <input
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
        <button disabled={!validEmail || !validPwd || !validMatch || isLoading}>Зарегистрироваться</button>
      </form>
      <p>
        Уже зарегистрированы?<br />
        <span className='line'>
    <Link href='/login'>
      <a>Войти</a>
    </Link>
  </span>
      </p>
    </section>
  )
}

export default Register
