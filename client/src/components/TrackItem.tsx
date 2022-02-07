import { Delete, Pause, PlayArrow }                    from '@mui/icons-material'
import { Card, Grid, IconButton }                      from '@mui/material'
import { useRouter }                                   from 'next/router'
import React, { FC }                                   from 'react'
import { useDeleteTrackMutation }                      from '../api/services/track.service'
import { useAppDispatch, useTypedSelector }            from '../hooks/store'
import { pauseTrack, play, playerSelector, setActive } from '../store/player.slice'
import { ITrack }                                      from '../types/track'

interface TrackItemProps {
  track: ITrack;
}

const TrackItem: FC<TrackItemProps> = ({ track }) => {

  const router = useRouter()
  const dispatch = useAppDispatch()

  const { pause, active } = useTypedSelector(playerSelector)
  const [deleteTrack] = useDeleteTrackMutation()

  const playTrack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (pause) {
      dispatch(setActive(track))
      dispatch(play())
    } else {
      dispatch(setActive(null))
      dispatch(pauseTrack())
    }
  }

  const onDeleteTrack = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    try {
      await deleteTrack(track._id)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Card
      className='track'
      onClick={() => router.push('/tracks/' + track._id)}
    >
      <IconButton onClick={playTrack}>
        {active && active._id === track._id
          ? <Pause />
          : <PlayArrow />
        }
      </IconButton>
      <img
        width={70}
        height={70}
        src={process.env.NEXT_PUBLIC_ENV_API_URL + '/' + track.picture}
      />
      <Grid
        container
        direction='column'
        style={{ width: 200, margin: '0 20px' }}
      >
        <div>{track.name}</div>
        <div style={{ fontSize: 12, color: 'gray' }}>{track.artist}</div>
      </Grid>
      {active && <div>02:20 / 03:22</div>}
      <IconButton
        onClick={onDeleteTrack}
        style={{ marginLeft: 'auto' }}
      >
        <Delete />
      </IconButton>
    </Card>
  )
}

export default TrackItem

