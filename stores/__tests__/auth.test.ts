import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should authenticate with correct credentials', async () => {
      const store = useAuthStore()
      const result = await store.login('admin@example.com', 'Password123!')
      
      expect(result).toBe(true)
      expect(store.isAuthenticated).toBe(true)
      expect(store.user).toBeDefined()
      expect(localStorage.getItem('token')).toBeDefined()
    })

    it('should fail with incorrect credentials', async () => {
      const store = useAuthStore()
      
      await expect(
        store.login('wrong@email.com', 'wrongpass')
      ).rejects.toThrow('Invalid email or password')
      
      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBeNull()
      expect(localStorage.getItem('auth_token')).toBeNull()
    })
  })

  describe('initAuth', () => {
    it('should restore auth state from localStorage', async () => {
      localStorage.setItem('auth_token', 'mock_jwt_token')
      
      const store = useAuthStore()
      await store.initAuth()
      
      expect(store.isAuthenticated).toBe(true)
      expect(store.user).toBeDefined()
    })

    it('should not restore auth state without token', async () => {
      const store = useAuthStore()
      await store.initAuth()
      
      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBeNull()
    })
  })

  describe('logout', () => {
    it('should clear auth state and localStorage', async () => {
      const store = useAuthStore()
      await store.login('admin@example.com', 'Password123!')
      
      store.logout()
      
      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBeNull()
      expect(localStorage.getItem('auth_token')).toBeNull()
    })
  })
})