import axios from 'axios'

// Create axios instance for API calls
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
