import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useAuthService } from '~/services/auth.service'  // Add this import
import axios from 'axios'

interface PharmacyProfile {
  picName: string
  picPhone: string
  picEmail: string
  pharmacyName: string
  pharmacyAddress: string
  pharmacistName: string
  sipa: string
  sia: string
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null as PharmacyProfile | null,
    loading: false
  }),

  actions: {
    initFromAuth() {
      const authStore = useAuthStore()
      if (authStore.user) {
        this.profile = {
          picName: authStore.user.picName || authStore.user.name || '',
          picPhone: authStore.user.picPhone || '',
          picEmail: authStore.user.email || '',
          pharmacyName: authStore.user.pharmacyName || '',
          pharmacyAddress: authStore.user.pharmacyAddress || '',
          pharmacistName: authStore.user.apotekerName || '',
          sipa: authStore.user.sipa || '',
          sia: authStore.user.sia || ''
        }
      }
    },

    async updateProfile(data: Partial<PharmacyProfile>) {
      this.loading = true
      const config = useRuntimeConfig()
      const API_URL = config.public.apiUrl
      const authService = useAuthService()
      
      try {
        console.log('Preparing to update profile with data:', data) // Debug log
        
        // Map frontend model to backend expected format
        const backendData = {
          name: data.picName,
          picName: data.picName,
          picPhone: data.picPhone,
          email: data.picEmail,
          pharmacyName: data.pharmacyName,
          pharmacyAddress: data.pharmacyAddress,
          apotekerName: data.pharmacistName,
          sipa: data.sipa,
          sia: data.sia
        }
        
        console.log('Sending data to API:', backendData) // Debug log
        
        // API call to update profile
        const response = await axios.put(`${API_URL}/profile`, backendData, {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        })
        
        console.log('API response:', response.data) // Debug log
        
        // Update local state
        this.profile = { ...this.profile, ...data }
        
        // Update auth store
        const authStore = useAuthStore()
        if (authStore.user) {
          authStore.user = {
            ...authStore.user,
            name: data.picName || authStore.user.name,
            picName: data.picName || authStore.user.picName,
            picPhone: data.picPhone || authStore.user.picPhone,
            email: data.picEmail || authStore.user.email,
            pharmacyName: data.pharmacyName || authStore.user.pharmacyName,
            pharmacyAddress: data.pharmacyAddress || authStore.user.pharmacyAddress,
            apotekerName: data.pharmacistName || authStore.user.apotekerName,
            sipa: data.sipa || authStore.user.sipa,
            sia: data.sia || authStore.user.sia
          }
        }
        
        return response.data
      } catch (error) {
        console.error('Failed to update profile:', error)
        // Check if it's an axios error with response
        if (error.response) {
          console.error('API error response:', error.response.data)
          throw new Error(error.response.data.message || 'Failed to update profile')
        }
        throw error
      } finally {
        this.loading = false
      }
    }
  },

  persist: {
    paths: ['profile']
  }
})