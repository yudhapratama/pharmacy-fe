import axios from 'axios'
import { useAuthService } from './auth.service'

interface Distributor {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  contactPerson?: string
  createdAt: string
  updatedAt: string
}

export const useDistributorService = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl
  const authService = useAuthService()

  return {
    async getAllDistributors(): Promise<Distributor[]> {
      const response = await axios.get(`${API_URL}/distributors`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      return response.data
    },

    async getDistributor(id: string): Promise<Distributor> {
      const response = await axios.get(`${API_URL}/distributors/${id}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      return response.data
    },

    async createDistributor(data: Partial<Distributor>): Promise<Distributor> {
      const response = await axios.post(`${API_URL}/distributors`, data, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      return response.data
    },

    async updateDistributor(id: string, data: Partial<Distributor>): Promise<Distributor> {
      const response = await axios.put(`${API_URL}/distributors/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      return response.data
    },

    async deleteDistributor(id: string): Promise<void> {
      await axios.delete(`${API_URL}/distributors/${id}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
    }
  }
}