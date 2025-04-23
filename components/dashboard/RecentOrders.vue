<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-medium">{{ title }}</h2>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>
    
    <div v-else-if="orders.length === 0" class="p-6 text-center text-gray-500">
      {{ translations.noOrdersFound }}
    </div>
    
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ translations.orderID }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ translations.item }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ translations.quantity }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ translations.status }}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ translations.actions }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ order.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ order.item }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ order.quantity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <UBadge :color="getStatusColor(order.status)">
                {{ order.status }}
              </UBadge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-eye"
                size="xs"
                @click="$router.push(`/orders/${order.uuid}`)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <UButton
        color="gray"
        variant="ghost"
        @click="$router.push('/orders')"
      >
        {{ translations.viewAllOrders }}
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { translations } from '~/utils/translations'

defineProps({
  orders: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: translations.recentOrders
  }
})

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'green'
    case 'processed':
    case 'published':
      return 'blue'
    case 'draft':
      return 'gray'
    default:
      return 'gray'
  }
}
</script>