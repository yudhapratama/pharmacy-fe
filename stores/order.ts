import { defineStore } from 'pinia'
import { useOrderService } from '~/services/order.service'

export interface OrderItem {
  id?: string
  name: string
  quantity: number
  unit: string
  activeIngredient?: string
  formAndStrength?: string
  quantityInWords?: string
  notes?: string
}

export interface Order {
  id?: string
  orderNumber: string
  distributorId: string
  distributorName?: string
  orderType: 'regular' | 'oot' | 'prekursor' | 'psikotropika' | 'narkotika'
  status: 'draft' | 'published' | 'completed'
  orderDate: string
  items: OrderItem[]
  createdAt?: string
  updatedAt?: string
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
    currentOrder: null as Order | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchOrders(params = {}) {
      this.loading = true
      try {
        const orderService = useOrderService()
        const orders = await orderService.getOrders(params)
        this.orders = orders
        return orders
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchOrderById(id: string) {
      this.loading = true
      try {
        const orderService = useOrderService()
        const order = await orderService.getOrderById(id)
        this.currentOrder = order
        return order
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOrder(orderData: Partial<Order>) {
      const toast = useToast()
      this.loading = true
      try {
        const orderService = useOrderService()
        const newOrder = await orderService.createOrder(orderData)
        this.orders.unshift(newOrder)
        toast.add({
          id: 'order-create',
          title: 'Success',
          description: 'Order created successfully',
          color: 'green',
          timeout: 5000
        })
        return newOrder
      } catch (error: any) {
        toast.add({
          id: 'order-error',
          title: 'Error',
          description: error.response?.data?.message || 'Failed to create order',
          color: 'red',
          timeout: 5000
        })
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Add toast handling to the updateOrder method
    async updateOrder(id: string, orderData: Partial<Order>) {
      const toast = useToast()
      this.loading = true
      try {
        const orderService = useOrderService()
        const updatedOrder = await orderService.updateOrder(id, orderData)
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders[index] = updatedOrder
        }
        toast.add({
          id: 'order-update',
          title: 'Success',
          description: 'Order updated successfully',
          color: 'green',
          timeout: 5000
        })
        return updatedOrder
      } catch (error: any) {
        toast.add({
          id: 'order-error',
          title: 'Error',
          description: error.response?.data?.message || 'Failed to update order',
          color: 'red',
          timeout: 5000
        })
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(id: string, status: 'draft' | 'published' | 'completed') {
      const toast = useToast()
      this.loading = true
      try {
        const orderService = useOrderService()
        const updatedOrder = await orderService.updateOrderStatus(id, status)
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders[index] = updatedOrder
        }
        toast.add({
          id: 'order-status',
          title: 'Success',
          description: `Order status updated to ${status}`,
          color: 'green',
          timeout: 5000
        })
        return updatedOrder
      } catch (error: any) {
        toast.add({
          id: 'order-error',
          title: 'Error',
          description: error.response?.data?.message || 'Failed to update order status',
          color: 'red',
          timeout: 5000
        })
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteOrder(id: string) {
      const toast = useToast()
      this.loading = true
      try {
        const orderService = useOrderService()
        await orderService.deleteOrder(id)
        this.orders = this.orders.filter(o => o.id !== id)
        toast.add({
          id: 'order-delete',
          title: 'Success',
          description: 'Order deleted successfully',
          color: 'green',
          timeout: 5000
        })
      } catch (error: any) {
        toast.add({
          id: 'order-error',
          title: 'Error',
          description: error.response?.data?.message || 'Failed to delete order',
          color: 'red',
          timeout: 5000
        })
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})