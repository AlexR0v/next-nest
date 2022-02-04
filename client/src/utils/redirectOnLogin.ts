import Router        from 'next/router'
import { useEffect } from 'react'

export const redirectOnLogin = () => {
  useEffect(() => {
    Router.push('/login')
  }, [])
  return null
}
