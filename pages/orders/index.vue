<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-semibold">{{ translations.orders }}</h1>
        <UButton
          color="black"
          icon="i-heroicons-plus"
          @click="router.push('/orders/create')"
        >
          {{ translations.createOrder }}
        </UButton>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <UFormGroup :label="translations.searchOrderID">
            <UInput
              v-model="filters.search"
              :placeholder="translations.enterOrderID"
              icon="i-heroicons-magnifying-glass"
              @keyup.enter="applyFilters"
            />
          </UFormGroup>

          <!-- Status Filter -->
          <UFormGroup :label="translations.status">
            <USelect
              v-model="filters.status"
              :options="statusOptions"
              :placeholder="translations.selectStatus"
            />
          </UFormGroup>

          <!-- Date Range -->
          <UFormGroup :label="translations.startDate">
            <UInput
              v-model="filters.startDate"
              type="date"
            />
          </UFormGroup>

          <UFormGroup :label="translations.endDate">
            <UInput
              v-model="filters.endDate"
              type="date"
            />
          </UFormGroup>
        </div>

        <div class="flex justify-end mt-4">
          <UButton
            color="gray"
            variant="solid"
            class="mr-2"
            @click="resetFilters"
          >
            {{ translations.reset }}
          </UButton>
          <UButton
            color="black"
            @click="applyFilters"
          >
            {{ translations.apply }}
          </UButton>
        </div>
      </div>

      <!-- Orders Table -->
      <UTable
        :rows="orders"
        :columns="columns"
        :loading="loading"
      >
        <template #orderType-data="{ row }">
          <UBadge :color="getOrderTypeColor(row.orderType)">
            {{ formatOrderType(row.orderType) }}
          </UBadge>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)">
            {{ formatStatus(row.status) }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="getActionItems(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-vertical"
            />
          </UDropdown>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup>
import { translations } from '~/utils/translations'

definePageMeta({
  layout: 'authenticated',
  middleware: ['auth']
})

const router = useRouter()
const orderStore = useOrderStore()
const distributorStore = useDistributorStore()

// Filters
const filters = ref({
  search: '',
  status: null,
  startDate: '',
  endDate: ''
})

const statusOptions = [
  { label: translations.draft, value: 'draft' },
  { label: translations.published, value: 'published' },
  { label: translations.completed, value: 'completed' }
]

// Table columns
const columns = [
  {
    key: 'orderNumber',
    label: translations.orderID
  },
  {
    key: 'distributorName',
    label: translations.distributorName
  },
  {
    key: 'orderType',
    label: translations.orderType
  },
  {
    key: 'orderDate',
    label: translations.orderDate
  },
  {
    key: 'status',
    label: translations.status
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  }
]

// Computed properties
const loading = computed(() => orderStore.loading)
const orders = computed(() => orderStore.orders)

// Methods
const applyFilters = async () => {
  try {
    const params = {}
    
    if (filters.value.search) {
      params.search = filters.value.search
    }
    
    if (filters.value.status) {
      params.status = filters.value.status
    }
    
    if (filters.value.startDate) {
      params.startDate = filters.value.startDate
    }
    
    if (filters.value.endDate) {
      params.endDate = filters.value.endDate
    }
    
    await orderStore.fetchOrders(params)
  } catch (error) {
    console.error('Error applying filters:', error)
  }
}

const resetFilters = () => {
  filters.value = {
    search: '',
    status: null,
    startDate: '',
    endDate: ''
  }
  orderStore.fetchOrders()
}

const formatOrderType = (type) => {
  switch (type) {
    case 'regular': return translations.regular
    case 'oot': return translations.oot
    case 'prekursor': return translations.prekursor
    case 'psikotropika': return translations.psikotropika
    case 'narkotika': return translations.narkotika
    default: return type
  }
}

const getOrderTypeColor = (type) => {
  switch (type) {
    case 'regular': return 'blue'
    case 'oot': return 'purple'
    case 'prekursor': return 'orange'
    case 'psikotropika': return 'red'
    case 'narkotika': return 'black'
    default: return 'gray'
  }
}

const formatStatus = (status) => {
  switch (status) {
    case 'draft': return translations.draft
    case 'published': return translations.published
    case 'completed': return translations.completed
    default: return status
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'draft': return 'gray'
    case 'published': return 'blue'
    case 'completed': return 'green'
    default: return 'gray'
  }
}

const handleView = (row) => {
  router.push(`/orders/${row.id}`)
}

const handleEdit = (row) => {
  if (row.status === 'draft') {
    console.log('Navigating to edit page:', `/orders/${row.id}/edit`)    
    router.push(`/orders/${row.id}/edit`)
  } else {
    const toast = useToast()
    toast.add({
      title: 'Cannot Edit',
      description: 'Only draft orders can be edited',
      color: 'orange'
    })
  }
}

// Fetch orders on mount
onMounted(async () => {
  try {
    await orderStore.fetchOrders()
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.add({
      id: 'fetch-error',
      title: 'Error',
      description: 'Failed to load orders',
      color: 'red',
      timeout: 5000
    })
  }
})

// handleExport function removed

const handleComplete = async (row) => {
  if (row.status === 'published') {
    try {
      await orderStore.updateOrderStatus(row.id, 'completed')
    } catch (error) {
      console.error('Error completing order:', error)
    }
  } else {
    const toast = useToast()
    toast.add({
      title: 'Cannot Complete',
      description: 'Only published orders can be marked as completed',
      color: 'orange'
    })
  }
}

const getActionItems = (row) => {
  const items = [
    [
      {
        label: translations.view,
        icon: 'i-heroicons-eye',
        click: () => handleView(row)
      }
    ]
  ]
  
  // Add edit and delete options only for draft orders
  if (row.status === 'draft') {
    items[0].push(
      {
        label: translations.edit,
        icon: 'i-heroicons-pencil',
        click: () => handleEdit(row)
      },
      {
        label: translations.delete,
        icon: 'i-heroicons-trash',
        click: () => handleDelete(row)
      }
    )
  }
  
  // Add complete option only for published orders
  if (row.status === 'published') {
    items[0].push({
      label: translations.markAsCompleted,
      icon: 'i-heroicons-check-circle',
      click: () => handleComplete(row)
    })
  }
  
  return items
}

// Fetch data on mount
onMounted(async () => {
  try {
    await Promise.all([
      orderStore.fetchOrders(),
      distributorStore.fetchDistributors()
    ])
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>