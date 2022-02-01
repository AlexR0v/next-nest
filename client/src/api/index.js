import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:5002/api'
})

export const apiPrivate = axios.create({
  baseURL: 'http://localhost:5002/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
