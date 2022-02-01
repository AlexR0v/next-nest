import { api } from '../api/index.js'

const useRefreshToken = () => {
  return async () => {
    const response = await api.post('/auth/refresh-token', { username: localStorage.getItem('username') }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    localStorage.setItem('token', response.data.access_token)
    return response.data.access_token
  }
}

export default useRefreshToken

