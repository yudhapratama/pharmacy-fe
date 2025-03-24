<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-semibold">Order Details</h1>
          <p class="text-gray-500">{{ order?.orderNumber }}</p>
        </div>
        <div class="flex gap-2">
          <UButton
            color="gray"
            variant="solid"
            icon="i-heroicons-arrow-left"
            @click="router.push('/orders')"
          >
            Back to Orders
          </UButton>
          <UButton
            v-if="order?.status === 'draft'"
            color="blue"
            icon="i-heroicons-paper-airplane"
            @click="handlePublish"
          >
            Publish
          </UButton>
          <UButton
            v-if="order?.status === 'published'"
            color="green"
            icon="i-heroicons-check"
            @click="handleComplete"
          >
            Mark as Completed
          </UButton>
          <UButton
            v-if="order?.status === 'draft'"
            color="red"
            icon="i-heroicons-trash"
            @click="handleDelete"
          >
            Delete
          </UButton>
          <UButton
            color="black"
            icon="i-heroicons-document-arrow-down"
            @click="handleExport"
          >
            Export PDF
          </UButton>
        </div>
      </div>

      <!-- Order Details -->
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      </div>

      <div v-else-if="order" class="bg-white rounded-lg shadow">
        <!-- Order Info -->
        <div class="p-6 border-b">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Order Information</h3>
              <div class="mt-2">
                <p class="text-sm"><span class="font-medium">Status:</span> 
                  <UBadge :color="getStatusColor(order.status)">
                    {{ formatStatus(order.status) }}
                  </UBadge>
                </p>
                <p class="text-sm mt-1"><span class="font-medium">Order Type:</span> 
                  <UBadge :color="getOrderTypeColor(order.orderType)">
                    {{ formatOrderType(order.orderType) }}
                  </UBadge>
                </p>
                <p class="text-sm mt-1"><span class="font-medium">Date:</span> {{ formatDate(order.orderDate) }}</p>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">Distributor</h3>
              <div class="mt-2">
                <p class="text-sm font-medium">{{ order.distributorName }}</p>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">Created</h3>
              <div class="mt-2">
                <p class="text-sm">{{ formatDate(order.createdAt) }}</p>
                <p class="text-sm mt-1" v-if="order.updatedAt !== order.createdAt">
                  <span class="font-medium">Last Updated:</span> {{ formatDate(order.updatedAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="p-6">
          <h3 class="text-lg font-medium mb-4">Order Items</h3>
          
          <UTable :columns="itemColumns" :rows="order.items">
            <template #name-data="{ row }">
              <div>
                <p class="font-medium">{{ row.name }}</p>
                <p v-if="row.activeIngredient" class="text-sm text-gray-500">
                  Active: {{ row.activeIngredient }}
                </p>
                <p v-if="row.formAndStrength" class="text-sm text-gray-500">
                  Form: {{ row.formAndStrength }}
                </p>
              </div>
            </template>
            
            <template #quantity-data="{ row }">
              {{ row.quantity }} {{ row.unit }}
              <p v-if="row.quantityInWords" class="text-sm text-gray-500">
                {{ row.quantityInWords }}
              </p>
            </template>
            
            <template #notes-data="{ row }">
              <p v-if="row.notes" class="text-sm">{{ row.notes }}</p>
              <p v-else class="text-sm text-gray-400">-</p>
            </template>
          </UTable>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 mx-auto text-yellow-500" />
        <h3 class="mt-4 text-lg font-medium">Order not found</h3>
        <p class="mt-2 text-gray-500">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <UButton class="mt-6" @click="router.push('/orders')">
          Back to Orders
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'authenticated',
  middleware: ['auth']
})

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()
const toast = useToast()
const loading = ref(true)
const order = ref(null)

// Table columns for order items
const itemColumns = [
  {
    key: 'name',
    label: 'Item'
  },
  {
    key: 'quantity',
    label: 'Quantity'
  },
  {
    key: 'notes',
    label: 'Notes'
  }
]

// Format functions
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatOrderType = (type) => {
  switch (type) {
    case 'regular':
      return 'Regular'
    case 'oot':
      return 'OOT'
    case 'prekursor':
      return 'Prekursor'
    case 'psikotropika':
      return 'Psikotropika'
    case 'narkotika':
      return 'Narkotika'
    default:
      return type
  }
}

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getOrderTypeColor = (type) => {
  switch (type) {
    case 'regular':
      return 'gray'
    case 'oot':
      return 'blue'
    case 'prekursor':
      return 'purple'
    case 'psikotropika':
      return 'orange'
    case 'narkotika':
      return 'red'
    default:
      return 'gray'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'draft':
      return 'gray'
    case 'published':
      return 'blue'
    case 'completed':
      return 'green'
    default:
      return 'gray'
  }
}

// Action handlers
const handlePublish = async () => {
  try {
    await orderStore.updateOrderStatus(order.value.id, 'published')
    order.value.status = 'published'
    toast.add({
      title: 'Success',
      description: 'Order has been published',
      color: 'green'
    })
  } catch (error) {
    console.error('Error publishing order:', error)
  }
}

const handleComplete = async () => {
  try {
    await orderStore.updateOrderStatus(order.value.id, 'completed')
    order.value.status = 'completed'
    toast.add({
      title: 'Success',
      description: 'Order has been marked as completed',
      color: 'green'
    })
  } catch (error) {
    console.error('Error completing order:', error)
  }
}

const handleDelete = async () => {
  try {
    await orderStore.deleteOrder(order.value.id)
    toast.add({
      title: 'Success',
      description: 'Order has been deleted',
      color: 'green'
    })
    router.push('/orders')
  } catch (error) {
    console.error('Error deleting order:', error)
  }
}

const handleExport = async () => {
  try {
    const orderService = useOrderService()
    const blob = await orderService.exportOrderPdf(order.value.id)
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob)
    
    // Create a link element
    const link = document.createElement('a')
    link.href = url
    link.download = `order-${order.value.orderNumber}.pdf`
    
    // Append to the document and trigger the download
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting order:', error)
    toast.add({
      title: 'Export Failed',
      description: 'Failed to export order as PDF',
      color: 'red'
    })
  }
}

// Fetch order data
onMounted(async () => {
  const orderId = route.params.id
  
  if (!orderId) {
    router.push('/orders')
    return
  }
  
  try {
    const fetchedOrder = await orderStore.fetchOrderById(orderId)
    order.value = fetchedOrder
  } catch (error) {
    console.error('Error fetching order:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load order details',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
})
</script>