import axios from 'axios'
import { storage } from '~/utils/storage'

export const useAuthService = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl

  return {
    async login(email: string, password: string): Promise<LoginResponse> {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      storage.setItem('token', response.data.token)
      storage.setItem('refreshToken', response.data.refreshToken)
      return response.data
    },

    async logout(): Promise<void> {
      const refreshToken = storage.getItem('refreshToken')
      try {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken })
      } finally {
        storage.removeItem('token')
        storage.removeItem('refreshToken')
      }
    },

    isAuthenticated(): boolean {
      return !!storage.getItem('token')
    },

    getToken(): string | null {
      return storage.getItem('token')
    }
  }
}
