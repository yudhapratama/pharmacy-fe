import axios from '~/utils/axios'

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post('/api/auth/refresh-token', { refreshToken })
        
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        
        originalRequest.headers.Authorization = `Bearer ${response.data.token}`
        return axios(originalRequest)
      } catch (err) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        navigateTo('/login')
      }
    }

    return Promise.reject(error)
  }
)