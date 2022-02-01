import React                            from 'react'
import ReactDOM                         from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App                              from './App'
import { AuthProvider }                 from './context/AuthContext.jsx'
import './index.css'

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route
          path='*'
          element={<App />}
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
