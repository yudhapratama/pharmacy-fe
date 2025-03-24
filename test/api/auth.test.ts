import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useAuth } from '../../composables/useAuth'
import axios from 'axios'

describe('Auth API Integration Tests', () => {
  const auth = useAuth()
  
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  })

  afterEach(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  })

  describe('Login API', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials = {
        email: 'admin@example.com',
        password: 'Password123!'
      }

      const response = await auth.login(credentials.email, credentials.password)
      
      expect(response).toBeDefined()
      expect(response.token).toBeDefined()
      expect(response.refreshToken).toBeDefined()
      expect(response.user).toBeDefined()
      expect(response.user.email).toBe(credentials.email)
      expect(localStorage.getItem('token')).toBe(response.token)
    })

    it('should handle network errors during login', async () => {
      const invalidUrl = 'http://invalid-url'
      const originalUrl = axios.defaults.baseURL
      axios.defaults.baseURL = invalidUrl

      try {
        await auth.login('test@example.com', 'password')
        throw new Error('Should not reach here')
      } catch (error) {
        expect(error).toBeDefined()
        expect(localStorage.getItem('token')).toBeNull()
      } finally {
        axios.defaults.baseURL = originalUrl
      }
    })
  })

  describe('User API', () => {
    it('should fetch current user with valid token', async () => {
      // Login first to get token
      await auth.login('admin@example.com', 'Password123!')
      
      const user = await auth.getCurrentUser()
      expect(user).toBeDefined()
      expect(user.email).toBe('admin@example.com')
    })

    it('should handle unauthorized access', async () => {
      localStorage.setItem('token', 'invalid-token')
      
      try {
        await auth.getCurrentUser()
        throw new Error('Should not reach here')
      } catch (error) {
        expect(error).toBeDefined()
        expect(error.response?.status).toBe(401)
      }
    })
  })

  describe('Logout API', () => {
    it('should successfully logout', async () => {
      // Login first
      await auth.login('admin@example.com', 'Password123!')
      expect(localStorage.getItem('token')).toBeDefined()
      
      await auth.logout()
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
    })

    it('should clear storage even if logout request fails', async () => {
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('refreshToken', 'test-refresh-token')
      
      // Force logout to fail with invalid token
      await auth.logout()
      
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
    })
  })
})