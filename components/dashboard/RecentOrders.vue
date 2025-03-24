<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium">Recent Orders</h3>
        <UButton
          variant="ghost"
          to="/orders"
          icon="i-heroicons-arrow-right"
          class="text-sm"
        >
          View All
        </UButton>
      </div>
    </template>

    <UTable
      :rows="orders"
      :columns="columns"
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
    </UTable>
  </UCard>
</template>

<script setup lang="ts">
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
  }
]

const getStatusColor = (status: string) => {
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

// Temporary prop until we integrate with API
defineProps<{
  orders: Array<{
    id: string
    distributor: string
    date: string
    status: string
  }>
}>()
</script>