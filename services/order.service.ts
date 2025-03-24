import axios from 'axios'
import { useAuthService } from './auth.service'
import type { Order } from '~/stores/order'

export const useOrderService = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl
  const authService = useAuthService()

  return {
    async getOrders(params = {}) {
      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        },
        params
      })
      return response.data
    },

    async getOrderById(id: string) {
      const response = await axios.get(`${API_URL}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      return response.data
    },

    async createOrder(data: Partial<Order>) {
      const response = await axios.post(`${API_URL}/orders`, data, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      return response.data
    },

    async updateOrder(id: string, data: Partial<Order>) {
      const response = await axios.put(`${API_URL}/orders/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      return response.data
    },

    async updateOrderStatus(id: string, status: string) {
      const response = await axios.patch(`${API_URL}/orders/${id}/status`, { status }, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      return response.data
    },

    async deleteOrder(id: string) {
      const response = await axios.delete(`${API_URL}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      return response.data
    },

    async exportOrderPdf(id: string) {
      const response = await axios.get(`${API_URL}/orders/${id}/export`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        },
        responseType: 'blob'
      })
      return response.data
    }
  }
}