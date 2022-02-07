import { Pause, PlayArrow, VolumeUp }                                               from '@mui/icons-material'
import { Grid, IconButton }                                                         from '@mui/material'
import React, { useEffect }                                                         from 'react'
import { useAppDispatch, useTypedSelector }                                         from '../hooks/store'
import { pauseTrack, play, playerSelector, setCurrentTime, setDuration, setVolume } from '../store/player.slice'
import TrackProgress                                                                from './TrackProgress'

let audio: HTMLAudioElement

const Player = () => {
  const { pause, volume, active, duration, currentTime } = useTypedSelector(playerSelector)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!audio) {
      audio = new Audio()
    } else {
      setAudio()
      playTrack()
    }
  }, [active])

  const setAudio = () => {
    if (active) {
      audio.src = process.env.NEXT_PUBLIC_ENV_API_URL + '/' + active.audio
      audio.volume = volume / 100
      audio.onloadedmetadata = () => {
        dispatch(setDuration(Math.ceil(audio.duration)))
      }
      audio.ontimeupdate = () => {
        dispatch(setCurrentTime(Math.ceil(audio.currentTime)))
      }
    }
  }

  const playTrack = () => {
    if (pause) {
      dispatch(play())
      audio.play()
    } else {
      dispatch(pauseTrack())
      audio.pause()
    }
  }

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.volume = Number(e.target.value) / 100
    dispatch(setVolume(Number(e.target.value)))
  }
  const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.currentTime = Number(e.target.value)
    dispatch(setCurrentTime(Number(e.target.value)))
  }

  if (!active) {
    return null
  }

  return (
    <div className='player'>
      <IconButton onClick={playTrack}>
        {pause
          ? <PlayArrow />
          : <Pause />
        }
      </IconButton>
      <Grid
        container
        direction='column'
        style={{ width: 'fit-content', margin: '0 20px' }}
      >
        <div>{active?.name}</div>
        <div style={{ fontSize: 12, color: 'gray' }}>{active?.artist}</div>
      </Grid>
      <TrackProgress
        left={currentTime}
        right={duration}
        onChange={changeCurrentTime}
      />
      <VolumeUp style={{ marginLeft: 'auto' }} />
      <TrackProgress
        left={volume}
        right={100}
        onChange={changeVolume}
      />
    </div>
  )
}

export default Player
