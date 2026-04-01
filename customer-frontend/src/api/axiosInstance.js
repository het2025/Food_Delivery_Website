import axios from 'axios'

// In production: VITE_API_BASE_URL = 'https://customer-backend-ibwg.onrender.com/api'
// In development: VITE_API_BASE_URL = '/api'  (Vite proxy forwards to localhost:5000)
// Strip any accidental trailing slash to keep URL joins consistent.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

// Create axios instance for API calls
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // withCredentials: true, // uncomment if backend uses cookies
})

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // You can add authorization token here if needed
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle global errors here
    return Promise.reject(error)
  }
)

export default axiosInstance
