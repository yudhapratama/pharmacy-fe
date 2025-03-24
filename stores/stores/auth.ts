import { defineStore } from 'pinia'
import { authService, type User } from '../services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await authService.login(email, password)
        this.user = response.user
        this.isAuthenticated = true
        return true
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed')
      }
    },

    async logout() {
      await authService.logout()
      this.user = null
      this.isAuthenticated = false
      navigateTo('/login')
    },

    async fetchUser() {
      try {
        const user = await authService.getCurrentUser()
        this.user = user
        this.isAuthenticated = true
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
      }
    }
  },

  persist: true
})