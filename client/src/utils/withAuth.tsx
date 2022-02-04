import { useRouter }                  from 'next/router'
import React, { useEffect, useState } from 'react'

function withAuth<T>(WrappedComponent: React.ComponentType<T>){
  return (props: T) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
      setMounted(true)
    }, [])
    if (typeof window !== 'undefined') {
      const router = useRouter()

      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        router.replace('/login')
        return null
      }
      return mounted && <WrappedComponent {...props} />
    }
    return null
  }
}

export default withAuth
