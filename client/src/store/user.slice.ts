import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState }                  from './index'

export interface InitialStateInterface {
  id: string
  username: string
  email: string
  isActivate: boolean
  access_token: string
}

const initialState: InitialStateInterface = {
  id: '',
  username: '',
  email: '',
  isActivate: false,
  access_token: ''
}

export const userSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    authUser: (state, action: PayloadAction<InitialStateInterface>) => {
      return action.payload
    },
    accessTokenUser: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload
    }
  }
})

export const { authUser, accessTokenUser } = userSlice.actions
export const userSelector = (state: RootState) => state.user

export default userSlice.reducer
