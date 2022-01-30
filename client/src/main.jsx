import React            from 'react'
import ReactDOM         from 'react-dom'
import App              from './App'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
)
