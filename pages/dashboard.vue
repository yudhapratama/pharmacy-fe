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
          value="156"
          icon="i-heroicons-shopping-cart"
          bgColor="bg-blue-500"
        />
        <DashboardStatsCard
          title="Pending Orders"
          value="23"
          icon="i-heroicons-clock"
          bgColor="bg-orange-500"
        />
        <DashboardStatsCard
          title="Completed Orders"
          value="89"
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
        :orders="orders"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'authenticated',
  middleware: ['auth']
})

const authStore = useAuthStore()
const distributorStore = useDistributorStore()
const router = useRouter()

// Get real-time distributor count
const distributorCount = computed(() => distributorStore.distributors.length)

// Fetch distributors on mount
onMounted(async () => {
  try {
    await distributorStore.fetchDistributors()
  } catch (error) {
    console.error('Failed to fetch distributors:', error)
  }
})

const currentTime = computed(() => {
  return new Date().toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

const columns = [
  {
    key: 'id',
    label: 'Order ID'
  },
  {
    key: 'item',
    label: 'Item'
  },
  {
    key: 'quantity',
    label: 'Quantity'
  },
  {
    key: 'status',
    label: 'Status'
  }
]

const orders = [
  {
    id: 'PO-20230501-0001',
    item: 'Paracetamol 500mg',
    quantity: '1000',
    status: 'Completed'
  },
  {
    id: 'PO-20230502-0002',
    item: 'Amoxicillin 500mg',
    quantity: '500',
    status: 'Processing'
  },
  {
    id: 'PO-20230503-0003',
    item: 'Vitamin C 1000mg',
    quantity: '200',
    status: 'Draft'
  },
  {
    id: 'PO-20230504-0004',
    item: 'Omeprazole 20mg',
    quantity: '300',
    status: 'Completed'
  },
  {
    id: 'PO-20230505-0005',
    item: 'Metformin 500mg',
    quantity: '400',
    status: 'Processing'
  }
]

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'green'
    case 'processing':
      return 'blue'
    case 'draft':
      return 'gray'
    default:
      return 'gray'
  }
}
</script>