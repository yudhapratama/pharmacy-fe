import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { storage } from '~/utils/storage'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  axios.defaults.baseURL = config.public.apiUrl
  
  axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = storage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  axios.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        storage.removeItem('token')
        storage.removeItem('refreshToken')
        // Let the auth store handle navigation
        const authStore = useAuthStore()
        authStore.isAuthenticated = false
        authStore.user = null
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      axios: axios
    }
  }
})