import { defineStore } from 'pinia'
import type { User } from '~/services/auth.service'
import { useAuthService } from '~/services/auth.service'
import { useProfileStore } from '~/stores/profile'  // Add this import
import { storage } from '~/utils/storage'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    isInitialized: false
  }),

  actions: {
    async initAuth() {
      // Prevent multiple initializations and SSR
      if (this.isInitialized) return
      if (!process.client) {
        this.isInitialized = true
        return
      }

      // Wait for hydration
      await nextTick()

      const authService = useAuthService()
      const token = authService.getToken()

      if (!token) {
        this.resetState(true)
        return
      }

      try {
        const user = await authService.getCurrentUser()
        if (user) {
          this.user = user
          this.isAuthenticated = true
        } else {
          this.resetState(true)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        this.resetState(true)
      } finally {
        this.isInitialized = true
      }
    },

    // Helper method to ensure consistent state reset
    // Modify resetState to accept optional parameter
    resetState(setInitialized = false) {
      this.user = null
      this.isAuthenticated = false
      this.isInitialized = setInitialized
    },

    // Existing methods remain unchanged
    async login(email: string, password: string) {
      const authService = useAuthService()
      try {
        const response = await authService.login(email, password)
        this.user = response.user
        this.isAuthenticated = true
        this.isInitialized = true
        return true
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed')
      }
    },

    async logout() {
      const authService = useAuthService()
      try {
        await authService.logout()
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        // Reset related stores
        const profileStore = useProfileStore()
        profileStore.$reset()
        
        // Reset auth store
        this.resetState()
        
        // Use router.push instead of navigateTo for more reliable navigation
        const router = useRouter()
        await router.push('/')
        window.location.reload()
      }
    },

    async fetchUser() {
      const authService = useAuthService()
      try {
        const user = await authService.getCurrentUser()
        this.user = user
        this.isAuthenticated = true
      } catch (error) {
        this.resetState()
      }
    }
  },

  persist: {
    paths: ['user', 'isAuthenticated', 'isInitialized']
  }
})