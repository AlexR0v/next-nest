import { Button, Grid, TextField } from '@mui/material'
import { useRouter }               from 'next/router'
import { useState }                from 'react'
import { useAddTrackMutation }     from '../../api/services/track.service'
import FileUpload                  from '../../components/FileUpload'
import StepWrapper                 from '../../components/StepWrapper'
import withAuth                    from '../../utils/withAuth'

const Create = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [picture, setPicture] = useState(null)
  const [audio, setAudio] = useState(null)
  const [name, setName] = useState('')
  const [artist, setArtist] = useState('')
  const [text, setText] = useState('')

  const router = useRouter()

  const [addTrack] = useAddTrackMutation()

  const next = async () => {
    if (activeStep !== 2) {
      setActiveStep(prev => prev + 1)
    } else {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('text', text)
      formData.append('artist', artist)
      formData.append('picture', picture || '')
      formData.append('audio', audio || '')
      try {
        await addTrack(formData)
        // const image: any = document.getElementById('image')
        // const picture: any = document.getElementById('image')
        // image.value = ''
        // picture.value = ''
        await router.push('/tracks')
      } catch (e) {
        console.log(e)
      }
    }
  }

  const back = () => {
    setActiveStep(prev => prev - 1)
  }

  return (
    <>
      <StepWrapper activeStep={activeStep}>
        {activeStep === 0 &&
          <Grid
            container
            direction={'column'}
            style={{ padding: 20 }}
          >
            <TextField
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ marginTop: 10 }}
              label={'Название трека'}
            />
            <TextField
              value={artist}
              onChange={e => setArtist(e.target.value)}
              style={{ marginTop: 10 }}
              label={'Имя исполнителя'}
            />
            <TextField
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ marginTop: 10 }}
              label={'Слова к треку'}
              multiline
              rows={3}
            />
          </Grid>
        }
        {activeStep === 1 &&
          <FileUpload
            id='image'
            setFile={setPicture}
            accept='image/*'
          >
            {
              picture ? <p>Отлично! Жми далее!</p>
                : <Button>Загрузить изображение</Button>
            }
          </FileUpload>
        }
        {activeStep === 2 &&
          <FileUpload
            id='picture'
            setFile={setAudio}
            accept='audio/*'
          >
            {
              audio ? <p>Отлично! Жми далее!</p>
                : <Button>Загрузить аудио</Button>
            }
          </FileUpload>
        }
      </StepWrapper>
      <Grid
        container
        justifyContent='center'
      >
        <Button
          disabled={activeStep === 0}
          onClick={back}
        >Назад</Button>
        <Button onClick={next}>Далее</Button>
      </Grid>
    </>
  )
}

export default withAuth(Create)
