import { useMemo }          from 'react'
import { userSelector }     from '../store/user.slice'
import { useTypedSelector } from './store'

export const useAuth = () => {
  const user = useTypedSelector(userSelector)

  return useMemo(() => ({ user }), [user])
}
