<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-semibold">Orders</h1>
        <div class="flex items-center gap-4">
          <UButton
            variant="ghost"
            icon="i-heroicons-arrow-down-tray"
            @click="exportOrders"
          >
            Export
          </UButton>
          <UButton
            variant="ghost"
            icon="i-heroicons-printer"
            @click="printOrders"
          >
            Print
          </UButton>
          <UButton
            color="black"
            icon="i-heroicons-plus"
            @click="isCreateModalOpen = true"
          >
            Create Order
          </UButton>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-4 mb-6">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search orders..."
          class="w-80"
        />
        <USelect
          v-model="statusFilter"
          :options="statusOptions"
          placeholder="All Statuses"
        />
        <USelect
          v-model="dateFilter"
          :options="dateOptions"
          placeholder="Last 30 days"
        />
        <UButton
          variant="ghost"
          icon="i-heroicons-funnel"
          @click="showFilters = true"
        >
          Filters
        </UButton>
      </div>

      <!-- Orders Table -->
      <UTable
        :rows="filteredOrders"
        :columns="columns"
        :loading="loading"
      >
        <template #status-data="{ row }">
          <UBadge
            :color="getStatusColor(row.status)"
            variant="subtle"
            size="sm"
          >
            {{ row.status }}
          </UBadge>
        </template>
        <template #total-data="{ row }">
          Rp {{ formatNumber(row.total) }}
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

      <!-- Create Order Modal -->
      <UModal v-model="isCreateModalOpen" :ui="{ width: 'max-w-2xl' }">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-semibold text-gray-900">
                  Create New Order
                </h3>
                <p class="text-sm text-gray-500">
                  Create a new purchase order for medications. Select a distributor and add items to your order.
                </p>
              </div>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="isCreateModalOpen = false"
              />
            </div>
          </template>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <UFormGroup label="Distributor" required>
              <USelect
                v-model="form.distributor"
                :options="distributorOptions"
                placeholder="Select a distributor"
              />
            </UFormGroup>

            <div>
              <div class="flex items-center justify-between mb-2">
                <UFormGroup label="Order Items" required class="mb-0" />
                <UButton
                  variant="ghost"
                  icon="i-heroicons-plus"
                  size="sm"
                  @click="addOrderItem"
                >
                  Add Item
                </UButton>
              </div>

              <div v-for="(item, index) in form.items" :key="index" class="flex gap-4 mb-4">
                <UInput
                  v-model="item.name"
                  placeholder="Item name"
                  class="flex-grow"
                />
                <UInput
                  v-model="item.quantity"
                  placeholder="Quantity"
                  type="number"
                  class="w-32"
                />
                <UButton
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  @click="removeOrderItem(index)"
                />
              </div>
            </div>
          </form>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                color="gray"
                variant="solid"
                @click="isCreateModalOpen = false"
              >
                Cancel
              </UButton>
              <UButton
                color="gray"
                variant="solid"
                @click="saveAsDraft"
                :loading="savingDraft"
              >
                Save as Draft
              </UButton>
              <UButton
                color="black"
                @click="publishOrder"
                :loading="publishing"
              >
                Publish Order
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'authenticated',
  middleware: ['auth']
})

const columns = [
  {
    key: 'id',
    label: 'Order ID'
  },
  {
    key: 'distributor',
    label: 'Distributor'
  },
  {
    key: 'date',
    label: 'Date'
  },
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'total',
    label: 'Total'
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  }
]

const orders = ref([
  {
    id: 'PO-20230501-0001',
    distributor: 'PT Maju Jaya Formasi',
    date: '2023-05-01',
    status: 'Completed',
    total: 5250000
  },
  {
    id: 'PO-20230502-0002',
    distributor: 'PT Kimia Farma',
    date: '2023-05-02',
    status: 'Processing',
    total: 3760000
  }
])

const loading = ref(false)
const search = ref('')
const statusFilter = ref(null)
const dateFilter = ref(null)
const isCreateModalOpen = ref(false)
const savingDraft = ref(false)
const publishing = ref(false)

const form = ref({
  distributor: null,
  items: [{ name: '', quantity: '' }]
})

const statusOptions = [
  { label: 'All Statuses', value: null },
  { label: 'Draft', value: 'draft' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' }
]

const dateOptions = [
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 60 days', value: '60' },
  { label: 'Last 90 days', value: '90' }
]

const distributorOptions = [
  { label: 'PT Maju Jaya Formasi', value: 'PT Maju Jaya Formasi' },
  { label: 'PT Kimia Farma', value: 'PT Kimia Farma' }
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

const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number)
}

const filteredOrders = computed(() => {
  let result = [...orders.value]

  if (search.value) {
    result = result.filter(order => 
      order.id.toLowerCase().includes(search.value.toLowerCase()) ||
      order.distributor.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    result = result.filter(order => 
      order.status.toLowerCase() === statusFilter.value.toLowerCase()
    )
  }

  return result
})

const addOrderItem = () => {
  form.value.items.push({ name: '', quantity: '' })
}

const removeOrderItem = (index) => {
  form.value.items.splice(index, 1)
}

const saveAsDraft = async () => {
  savingDraft.value = true
  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    isCreateModalOpen.value = false
    resetForm()
  } finally {
    savingDraft.value = false
  }
}

const publishOrder = async () => {
  publishing.value = true
  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    isCreateModalOpen.value = false
    resetForm()
  } finally {
    publishing.value = false
  }
}

const resetForm = () => {
  form.value = {
    distributor: null,
    items: [{ name: '', quantity: '' }]
  }
}

const exportOrders = () => {
  // TODO: Implement export functionality
}

const printOrders = () => {
  window.print()
}

const getActionItems = (row) => [
  {
    label: 'View',
    icon: 'i-heroicons-eye',
    click: () => handleView(row)
  },
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    click: () => handleEdit(row)
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: () => handleDelete(row)
  }
]

const handleView = (row) => {
  // TODO: Implement view functionality
}

const handleEdit = (row) => {
  // TODO: Implement edit functionality
}

const handleDelete = async (row) => {
  // TODO: Implement delete functionality
}
</script>