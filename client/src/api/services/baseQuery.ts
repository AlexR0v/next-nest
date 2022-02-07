import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState }                                                   from '../../store/index'

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_ENV_API_URL + '/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { user: { access_token } } = getState() as RootState
    if (access_token) {
      headers.set('authorization', `Bearer ${access_token}`)
    }
    return headers
  }
})

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 403) {
    const refreshResult: any = await baseQuery({
      url: 'auth/refresh-token',
      method: 'GET'
    }, api, extraOptions)
    if (refreshResult.data) {
      const { access_token } = refreshResult.data
      localStorage.setItem('access_token', access_token as string)
      result = await baseQuery(args, api, extraOptions)
    } else {
      localStorage.removeItem('access_token')
      await baseQuery({
        url: 'auth/logout',
        method: 'GET'
      }, api, extraOptions)
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }
  if (result.error && result.error.status === 401) {
    localStorage.removeItem('access_token')
    await baseQuery({
      url: 'auth/logout',
      method: 'GET'
    }, api, extraOptions)
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
  return result
}
