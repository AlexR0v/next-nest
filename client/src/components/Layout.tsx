import { FC } from 'react'

const Layout: FC = ({ children }) => {
  return (
    <main className='App'>
      {children}
    </main>
  )
}

export default Layout
