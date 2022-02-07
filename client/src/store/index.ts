import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi }        from '../api/services/auth.service'
import { trackApi }       from '../api/services/track.service'
import playerSlice        from './player.slice'
import userSlice          from './user.slice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    player: playerSlice,
    [authApi.reducerPath]: authApi.reducer,
    [trackApi.reducerPath]: trackApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, trackApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
