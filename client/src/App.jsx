import { Route, Routes } from 'react-router-dom'
import Admin             from './components/Admin.jsx'
import Editor            from './components/Editor.jsx'
import Home              from './components/Home.jsx'
import Layout            from './components/Layout.jsx'
import LinkPage          from './components/LinkPage.jsx'
import Login             from './components/Login.jsx'
import Lounge            from './components/Lounge.jsx'
import Missing           from './components/Missing.jsx'
import Register          from './components/Register.jsx'
import RequireAuth       from './components/RequireAuth.jsx'
import Unauthorized      from './components/Unauthorized.jsx'

function App () {
  return (
    <Routes>
      <Route
        path='/'
        element={<Layout />}
      >
        <Route element={<RequireAuth />}>
          <Route
            path='/'
            element={<Home />}
          />
        </Route>

        <Route element={<RequireAuth />}>
          <Route
            path='editor'
            element={<Editor />}
          />
        </Route>


        <Route element={<RequireAuth />}>
          <Route
            path='admin'
            element={<Admin />}
          />
        </Route>

        <Route element={<RequireAuth />}>
          <Route
            path='lounge'
            element={<Lounge />}
          />
        </Route>
        <Route
          path='login'
          element={<Login />}
        />
        <Route
          path='register'
          element={<Register />}
        />
        <Route
          path='linkpage'
          element={<LinkPage />}
        />
        <Route
          path='unauthorized'
          element={<Unauthorized />}
        />
        <Route
          path='*'
          element={<Missing />}
        />
      </Route>
    </Routes>
  )
}

export default App
