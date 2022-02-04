import { createApi }           from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export interface ResponseRegisterInterface {
  success: boolean
}

export interface ResponseLoginInterface {
  id: string
  username: string
  email: string
  isActivate: boolean
  access_token: string
}

export interface RequestRequestRegister {
  email: string
  username: string
  password: string
}

export interface RequestRequest {
  email: string
  password: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<ResponseRegisterInterface, RequestRequestRegister>({
      query: ({ username, email, password }) => ({
        url: '/auth/register',
        method: 'POST',
        body: { username, email, password }
      })
    }),
    login: builder.mutation<ResponseLoginInterface, RequestRequest>({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password }
      })
    }),
    getAllUsers: builder.mutation({
      query: () => ({
        url: '/auth/users',
        method: 'GET'
      })
    })
  })
})

export const { useRegisterMutation, useLoginMutation, useGetAllUsersMutation } = authApi
