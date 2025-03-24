<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <DashboardTimeDisplay />
        <UButton
          color="black"
          icon="i-heroicons-plus"
          @click="router.push('/orders/create')"
        >
          Create Order
        </UButton>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStatsCard
          title="Total Orders"
          :value="orderStats.total.toString()"
          icon="i-heroicons-shopping-cart"
          bgColor="bg-blue-500"
        />
        <DashboardStatsCard
          title="Processed Orders"
          :value="orderStats.pending.toString()"
          icon="i-heroicons-clock"
          bgColor="bg-orange-500"
        />
        <DashboardStatsCard
          title="Completed Orders"
          :value="orderStats.completed.toString()"
          icon="i-heroicons-check-circle"
          bgColor="bg-green-500"
        />
        <DashboardStatsCard
          title="Total Distributors"
          :value="distributorCount"
          icon="i-heroicons-building-storefront"
          bgColor="bg-purple-500"
        />
      </div>

      <!-- Recent Orders -->
      <DashboardRecentOrders
        :orders="recentOrders"
        :loading="loadingOrders"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useDistributorStore } from '~/stores/distributor'
import { useOrderStore } from '~/stores/order'

definePageMeta({
  layout: 'authenticated',
  middleware: ['auth']
})

const authStore = useAuthStore()
const distributorStore = useDistributorStore()
const orderStore = useOrderStore()
const router = useRouter()
const loadingOrders = ref(true)

// Order statistics
const orderStats = computed(() => {
  const orders = orderStore.orders
  
  return {
    total: orders.length,
    pending: orders.filter(order => order.status === 'published').length,
    completed: orders.filter(order => order.status === 'completed').length
  }
})

// Get real-time distributor count
const distributorCount = computed(() => distributorStore.distributors.length)

// Format recent orders for display
const recentOrders = computed(() => {
  return orderStore.orders
    .slice(0, 5)
    .map(order => ({
      id: order.orderNumber,
      uuid: order.id, // Add the UUID for navigation
      item: order.items && order.items.length > 0 ? order.items[0].name : 'N/A',
      quantity: order.items && order.items.length > 0 ? `${order.items[0].quantity} ${order.items[0].unit}` : 'N/A',
      status: order.status || 'Draft'
    }))
})

// Fetch data on mount
onMounted(async () => {
  try {
    await Promise.all([
      distributorStore.fetchDistributors(),
      orderStore.fetchOrders()
    ])
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loadingOrders.value = false
  }
})
</script>