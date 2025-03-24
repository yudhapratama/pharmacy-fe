import { defineStore } from 'pinia'
import { useDistributorService } from '~/services/distributor.service'
import { useToastMessages } from '~/utils/toast'

interface Distributor {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  createdAt: string
  updatedAt: string
}

export const useDistributorStore = defineStore('distributor', {
  state: () => ({
    distributors: [] as Distributor[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchDistributors() {
      this.loading = true
      this.error = null
      try {
        const distributorService = useDistributorService()
        const data = await distributorService.getAllDistributors()
        this.distributors = data
      } catch (error) {
        this.error = error.message || 'Failed to fetch distributors'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createDistributor(data: Partial<Distributor>) {
      const toast = useToast()
      this.loading = true
      try {
        const distributorService = useDistributorService()
        const newDistributor = await distributorService.createDistributor(data)
        this.distributors.push(newDistributor)
        toast.add({
          id: 'distributor-create',
          title: 'Success',
          description: 'Distributor added successfully',
          color: 'green',
          timeout: 5000
        })
        return newDistributor
      } catch (error) {
        toast.add({
          id: 'distributor-error',
          title: 'Error',
          description: error.response?.data?.message || 'Failed to add distributor',
          color: 'red',
          timeout: 5000
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateDistributor(id: string, data: Partial<Distributor>) {
      const toast = useToastMessages()
      this.loading = true
      try {
        const distributorService = useDistributorService()
        const updated = await distributorService.updateDistributor(id, data)
        const index = this.distributors.findIndex(d => d.id === id)
        if (index !== -1) {
          this.distributors[index] = updated
        }
        toast.updated('Distributor')
        return updated
      } catch (error) {
        toast.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteDistributor(id: string) {
      const toast = useToastMessages()
      this.loading = true
      try {
        const distributorService = useDistributorService()
        await distributorService.deleteDistributor(id)
        this.distributors = this.distributors.filter(d => d.id !== id)
        toast.deleted('Distributor')
      } catch (error) {
        toast.error(error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})