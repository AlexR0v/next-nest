import { Container }                  from '@mui/material'
import { useRouter }                  from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRefreshTokenMutation }    from '../api/services/auth.service'
import Navbar                         from '../components/Navbar'
import { useAppDispatch }             from '../hooks/store'
import { useAuth }                    from '../hooks/useAuth'
import { accessTokenUser }            from '../store/user.slice'

function withAuth<T>(WrappedComponent: React.ComponentType<T>){
  return (props: T) => {
    const dispatch = useAppDispatch()
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshToken] = useRefreshTokenMutation()
    const { user } = useAuth()
    if (typeof window !== 'undefined') {
      const router = useRouter()
      useEffect(() => {

        let isMounted = true

        const verifyRefreshToken = async () => {
          try {
            const { access_token } = await refreshToken('').unwrap()
            if (JSON.parse(JSON.stringify(localStorage.getItem('persist'))) === 'false') {
              await router.replace('/login')
            }
            dispatch(accessTokenUser(access_token))
          } catch (err) {
            console.error(err)
          } finally {
            isMounted && setLoading(false)
          }
        }
        !user.access_token
          ? verifyRefreshToken()
          : setLoading(false)
        setMounted(true)
        return () => {
          isMounted = false
        }
      }, [])
      return mounted && (
        <>
          {
            loading
              ? <h2>Loading...</h2>
              : <>
                <Navbar />
                <Container style={{ margin: '90px 0' }}>
                  <WrappedComponent {...props} />
                </Container>
              </>
          }
        </>
      )
    }
    return null
  }
}

export default withAuth
