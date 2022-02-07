import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlayerState }                from '../types/player'
import { ITrack }                     from '../types/track'
import { RootState }                  from './index'

const initialState: PlayerState = {
  currentTime: 0,
  duration: 0,
  active: null,
  volume: 50,
  pause: true
}

export const playerSlice = createSlice({
  name: 'playerSlice',
  initialState,
  reducers: {
    pauseTrack: (state) => {
      state.pause = true
    },
    play: (state) => {
      state.pause = false
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    setActive: (state, action: PayloadAction<ITrack | null>) => {
      state.active = action.payload
      state.duration = 0
      state.currentTime = 0
    }
  }
})

export const {
  pauseTrack,
  play,
  setActive,
  setVolume,
  setCurrentTime,
  setDuration
} = playerSlice.actions

export const playerSelector = (state: RootState) => state.player

export default playerSlice.reducer
