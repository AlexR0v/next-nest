import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5002/api',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`)
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
