import Head   from 'next/head'
import { FC } from 'react'

const Layout: FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>Музыкальная площадка</title>
        <meta
          name='description'
          content='Музыкальная площадка'
        />
        <meta
          name='robots'
          content='index, follow'
        />
        <meta
          name='keywords'
          content='Музыка, треки, артисты'
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
      </Head>
      <main className='App'>
        {children}
      </main>
    </>
  )
}

export default Layout
