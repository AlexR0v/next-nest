import { Button, Grid, TextField }                 from '@mui/material'
import { useRouter }                               from 'next/router'
import { useState }                                from 'react'
import { useAddCommentMutation, useGetTrackQuery } from '../../api/services/track.service'
import withAuth                                    from '../../utils/withAuth'

const TrackPage = () => {

  const [text, setText] = useState('')

  const router = useRouter()

  const { data, isLoading } = useGetTrackQuery(router.query.id)

  const [addComment] = useAddCommentMutation()

  if (isLoading) return <h2>Loading...</h2>

  const createMarkup = () => {
    return { __html: data.text?.split('\n').join('<br/>') }
  }

  return (
    <>
      <Button
        variant={'outlined'}
        style={{ fontSize: 20 }}
        onClick={() => router.push('/tracks')}
      >
        К списку
      </Button>
      <Grid
        container
        style={{ margin: '20px 0' }}
      >
        <img
          src={process.env.NEXT_PUBLIC_ENV_API_URL + '/' + data.picture}
          width={200}
          height={200}
        />
        <div style={{ marginLeft: 30 }}>
          <h3>Название трека - {data.name}</h3>
          <h3>Исполнитель - {data.artist}</h3>
          <h3>Прослушиваний - {data.listens}</h3>
        </div>
      </Grid>
      <h3>Слова в треке</h3>
      <p dangerouslySetInnerHTML={createMarkup()} />
      <h3>Комментарии</h3>
      <Grid container>
        <TextField
          //label='Комментарий'
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
          }}
        />
        <Button
          onClick={() => {
            if (text) {
              addComment({ text, trackId: router.query.id })
              setText('')
            }
          }}
        >Отправить</Button>
      </Grid>
      <div>
        {data.comments.map((comment: any) =>
          <div key={comment._id}>
            <div>Автор - {comment.userId.username}</div>
            <div>Комментарий - {comment.text}</div>
          </div>
        )}
      </div>
    </>
  )
}

export default withAuth(TrackPage)
