import axios from 'axios'

export const API_BASE =
  import.meta.env.VITE_API_BASE?.trim() || 'http://localhost:8123/api'

export const http = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
})

