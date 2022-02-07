import { Box, Button, Card, Grid } from '@mui/material'
import { useRouter }               from 'next/router'
import { useGetAllTracksQuery }    from '../../api/services/track.service'
import Player                      from '../../components/Player'
import TrackList                   from '../../components/TrackList'
import withAuth                    from '../../utils/withAuth'

const Index = () => {

  const router = useRouter()
  const { data, isLoading } = useGetAllTracksQuery('')

  if (isLoading) return <h2>Loading....</h2>
  return (
    <>
      <Grid
        container
        justifyContent='center'
      >
        <Card style={{ width: 900 }}>
          <Box p={3}>
            <Grid
              container
              justifyContent='space-between'
            >
              <h1>Список треков</h1>
              <Button onClick={() => router.push('/tracks/create')}>
                Загрузить
              </Button>
            </Grid>
          </Box>
          <TrackList tracks={data} />
        </Card>
      </Grid>
      <Player />
    </>
  )
}

export default withAuth(Index)

