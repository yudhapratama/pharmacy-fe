<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-semibold">Edit Order</h1>
          <p class="text-gray-500">{{ order?.orderNumber }}</p>
        </div>
        <div class="flex gap-2">
          <UButton
            color="gray"
            variant="solid"
            icon="i-heroicons-arrow-left"
            @click="router.push(`/orders/${route.params.id}`)"
          >
            Back to Order
          </UButton>
          <UButton
            color="blue"
            icon="i-heroicons-check"
            :loading="submitting"
            @click="handleSubmit"
          >
            Save Changes
          </UButton>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      </div>

      <!-- Form -->
      <div v-else-if="order" class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <UFormGroup label="Distributor" required>
              <USelect
                v-model="form.distributorId"
                :options="distributorOptions"
                placeholder="Select a distributor"
                :loading="distributorStore.loading"
              />
            </UFormGroup>
          </div>
          <div>
            <UFormGroup label="Order Type" required>
              <USelect
                v-model="form.orderType"
                :options="orderTypeOptions"
                placeholder="Select order type"
              />
            </UFormGroup>
          </div>
          <div>
            <UFormGroup label="Order Date" required>
              <UInput
                v-model="form.orderDate"
                type="date"
              />
            </UFormGroup>
          </div>
        </div>

        <!-- Order Items -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Order Items</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-plus"
              @click="addItem"
            >
              Add Item
            </UButton>
          </div>

          <div v-for="(item, index) in form.items" :key="index" class="bg-gray-50 p-4 rounded-lg mb-4">
            <div class="flex justify-between items-start mb-4">
              <h4 class="font-medium">Item #{{ index + 1 }}</h4>
              <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                size="xs"
                @click="removeItem(index)"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <UFormGroup label="Item Name" required>
                <UInput
                  v-model="item.name"
                  placeholder="Enter item name"
                />
              </UFormGroup>

              <div class="grid grid-cols-2 gap-4">
                <UFormGroup label="Quantity" required>
                  <UInput
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    placeholder="Quantity"
                  />
                </UFormGroup>
                <UFormGroup label="Unit" required>
                  <UInput
                    v-model="item.unit"
                    placeholder="e.g., Box, Bottle"
                  />
                </UFormGroup>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="Active Ingredient">
                <UInput
                  v-model="item.activeIngredient"
                  placeholder="Active ingredient"
                />
              </UFormGroup>
              <UFormGroup label="Form & Strength">
                <UInput
                  v-model="item.formAndStrength"
                  placeholder="e.g., Tablet 500mg"
                />
              </UFormGroup>
            </div>

            <UFormGroup label="Quantity in Words">
              <UInput
                v-model="item.quantityInWords"
                placeholder="e.g., Ten boxes"
              />
            </UFormGroup>

            <UFormGroup label="Notes">
              <UTextarea
                v-model="item.notes"
                placeholder="Additional notes"
                rows="2"
              />
            </UFormGroup>
          </div>

          <div v-if="form.items.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
            <p class="text-gray-500">No items added yet. Click "Add Item" to start.</p>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 mx-auto text-yellow-500" />
        <h3 class="mt-4 text-lg font-medium">Order not found</h3>
        <p class="mt-2 text-gray-500">The order you're trying to edit doesn't exist or you don't have permission to edit it.</p>
        <UButton class="mt-6" @click="router.push('/orders')">
          Back to Orders
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@nuxt/ui'
import { useOrderStore } from '~/stores/order'
import { useDistributorStore } from '~/stores/distributor'

definePageMeta({
  layout: 'authenticated',
  middleware: ['auth']
})

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()
const distributorStore = useDistributorStore()
const toast = useToast()
const loading = ref(true)
const submitting = ref(false)
const order = ref(null)

// Form data
const form = reactive({
  distributorId: '',
  orderType: 'regular',
  orderDate: '',
  items: []
})

// Options for selects
const orderTypeOptions = [
  { label: 'Regular', value: 'regular' },
  { label: 'OOT', value: 'oot' },
  { label: 'Prekursor', value: 'prekursor' },
  { label: 'Psikotropika', value: 'psikotropika' },
  { label: 'Narkotika', value: 'narkotika' }
]

const distributorOptions = computed(() => {
  return distributorStore.distributors.map(distributor => ({
    label: distributor.name,
    value: distributor.id
  }))
})

// Item management
const addItem = () => {
  form.items.push({
    name: '',
    quantity: 1,
    unit: '',
    activeIngredient: '',
    formAndStrength: '',
    quantityInWords: '',
    notes: ''
  })
}

const removeItem = (index) => {
  form.items.splice(index, 1)
}

// Form validation
const validateForm = () => {
  if (!form.distributorId || !form.orderType || !form.orderDate) {
    return false
  }

  if (form.items.length === 0) {
    return false
  }

  for (const item of form.items) {
    if (!item.name || !item.quantity || !item.unit) {
      return false
    }
  }

  return true
}

// Submit handler
// Update the handleSubmit function to remove toast handling
const handleSubmit = async () => {
  if (!validateForm()) {
    toast.add({
      id: 'validation-error',
      title: 'Validation Error',
      description: 'Please fill in all required fields',
      color: 'red',
      timeout: 5000
    })
    return
  }
  
  submitting.value = true
  
  try {
    // Get distributor name
    const distributor = distributorStore.distributors.find(d => d.id === form.distributorId)
    
    const orderData = {
      ...form,
      distributorName: distributor?.name
    }
    
    await orderStore.updateOrder(route.params.id, orderData)
    
    // Redirect to order details
    router.push(`/orders/${route.params.id}`)
  } catch (error) {
    console.error('Error updating order:', error)
    // No need to show toast here as it's handled in the store
  } finally {
    submitting.value = false
  }
}

// Fetch data
onMounted(async () => {
  const orderId = route.params.id
  
  if (!orderId) {
    router.push('/orders')
    return
  }
  
  try {
    // Fetch distributors if not already loaded
    if (distributorStore.distributors.length === 0) {
      await distributorStore.fetchDistributors()
    }
    
    // Fetch order
    const fetchedOrder = await orderStore.fetchOrderById(orderId)
    order.value = fetchedOrder
    
    // Populate form with order data
    form.distributorId = fetchedOrder.distributorId
    form.orderType = fetchedOrder.orderType
    form.orderDate = fetchedOrder.orderDate
    form.items = [...fetchedOrder.items]
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