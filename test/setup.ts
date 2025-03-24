import { vi } from 'vitest'

// Mock window.localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn()
}
global.localStorage = localStorageMock

// Mock useAuth composable
vi.mock('../composables/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      user: {
        email: 'admin@example.com',
        id: '1',
        name: 'Admin'
      }
    }),
    getCurrentUser: vi.fn().mockResolvedValue({
      email: 'admin@example.com',
      id: '1',
      name: 'Admin'
    }),
    logout: vi.fn().mockResolvedValue(undefined),
    isAuthenticated: vi.fn().mockReturnValue(true),
    getToken: vi.fn().mockReturnValue('mock-token')
  })
}))