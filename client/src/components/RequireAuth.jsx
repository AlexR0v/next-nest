import { Navigate, Outlet, useLocation } from 'react-router-dom'

const RequireAuth = () => {
  const location = useLocation()

  return (
    localStorage.getItem('token')
      ? <Outlet />
      : <Navigate
        to='/login'
        state={{ from: location }}
        replace
      />

  )
}

export default RequireAuth
