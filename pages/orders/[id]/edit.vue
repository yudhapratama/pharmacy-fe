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
            variant="outline"
            color="gray"
            to="/orders"
          >
            Cancel
          </UButton>
          <UButton
            color="black"
            :loading="loading"
            @click="saveOrder"
          >
            Save Changes
          </UButton>
        </div>
      </div>

      <!-- Form -->
      <UCard v-if="order">
        <UForm :state="form">
          <!-- Order Details -->
          <div class="space-y-8">
            <div>
              <h2 class="text-xl font-semibold mb-4">Order Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormGroup label="Order Number" required>
                  <UInput v-model="form.orderNumber" placeholder="Enter order number" />
                </UFormGroup>
                
                <UFormGroup label="Order Type" required>
                  <USelect
                    v-model="form.orderType"
                    :options="orderTypes"
                    option-attribute="label"
                    value-attribute="value"
                  />
                </UFormGroup>
                
                <UFormGroup label="Distributor" required>
                  <USelect
                    v-model="form.distributorId"
                    :options="distributors"
                    option-attribute="name"
                    value-attribute="id"
                    @update:model-value="updateDistributorName"
                  />
                </UFormGroup>
                
                <UFormGroup label="Order Date" required>
                  <UInput
                    v-model="form.orderDate"
                    type="date"
                  />
                </UFormGroup>
              </div>
            </div>
            
            <!-- Order Items -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Order Items</h2>
                <UButton
                  variant="ghost"
                  icon="i-heroicons-plus"
                  @click="addItem"
                >
                  Add Item
                </UButton>
              </div>
              
              <div v-if="form.items.length === 0" class="text-center py-8 border border-dashed rounded-lg">
                <p class="text-gray-500">No items added yet. Click "Add Item" to start.</p>
              </div>
              
              <div v-else class="space-y-4">
                <UCard v-for="(item, index) in form.items" :key="index" class="relative">
                  <button 
                    type="button"
                    class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    @click="removeItem(index)"
                  >
                    <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
                  </button>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormGroup label="Item Name" required>
                      <UInput v-model="item.name" placeholder="Enter item name" />
                    </UFormGroup>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <UFormGroup label="Quantity" required>
                        <UInput v-model.number="item.quantity" type="number" min="1" />
                      </UFormGroup>
                      
                      <UFormGroup label="Unit" required>
                        <UInput v-model="item.unit" placeholder="e.g. Box, Bottle" />
                      </UFormGroup>
                    </div>
                    
                    <UFormGroup label="Active Ingredient">
                      <UInput v-model="item.activeIngredient" placeholder="Enter active ingredient" />
                    </UFormGroup>
                    
                    <UFormGroup label="Form & Strength">
                      <UInput v-model="item.formAndStrength" placeholder="e.g. Tablet 500mg" />
                    </UFormGroup>
                    
                    <UFormGroup label="Quantity in Words" class="md:col-span-2">
                      <UInput v-model="item.quantityInWords" placeholder="e.g. Ten boxes" />
                    </UFormGroup>
                    
                    <UFormGroup label="Notes" class="md:col-span-2">
                      <UTextarea v-model="item.notes" placeholder="Additional notes" />
                    </UFormGroup>
                  </div>
                </UCard>
              </div>
            </div>
          </div>
        </UForm>
      </UCard>
      
      <div v-else class="flex justify-center items-center h-64">
        <USpinner />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'authenticated',
  middleware: ['auth']
})

import { useRoute, useRouter, navigateTo } from '#app'
import { useOrderStore } from '~/stores/order'
import { useDistributorStore } from '~/stores/distributor'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const distributorStore = useDistributorStore()

const orderId = route.params.id
const loading = ref(false)
const order = ref(null)

// Form state
const form = ref({
  orderNumber: '',
  distributorId: '',
  distributorName: '',
  orderType: 'regular',
  status: 'draft',
  orderDate: new Date().toISOString().split('T')[0],
  items: []
})

// Order types
const orderTypes = [
  { label: 'Regular', value: 'regular' },
  { label: 'OOT', value: 'oot' },
  { label: 'Prekursor', value: 'prekursor' },
  { label: 'Psikotropika', value: 'psikotropika' },
  { label: 'Narkotika', value: 'narkotika' }
]

// Fetch distributors
const distributors = ref([])
onMounted(async () => {
  try {
    distributors.value = await distributorStore.fetchDistributors()
    await fetchOrder()
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

// Fetch order data
async function fetchOrder() {
  try {
    console.log('Fetching order with ID:', orderId)
    order.value = await orderStore.fetchOrderById(orderId)
    console.log('Fetched order:', order.value)
    
    // Only allow editing draft orders
    if (order.value.status !== 'draft') {
      console.log('Order is not in draft status, redirecting')
      useToast().add({
        title: 'Cannot Edit',
        description: 'Only draft orders can be edited',
        color: 'orange'
      })
      router.push(`/orders/${orderId}`)
      return
    }
    
    console.log('Order is in draft status, populating form')
    // Populate form with order data
    form.value = {
      orderNumber: order.value.orderNumber,
      distributorId: order.value.distributorId,
      distributorName: order.value.distributorName,
      orderType: order.value.orderType,
      status: order.value.status,
      orderDate: order.value.orderDate.split('T')[0],
      items: order.value.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        activeIngredient: item.activeIngredient || '',
        formAndStrength: item.formAndStrength || '',
        quantityInWords: item.quantityInWords || '',
        notes: item.notes || ''
      }))
    }
    console.log('Form populated:', form.value)
  } catch (error) {
    console.error('Error fetching order:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load order data',
      color: 'red'
    })
    router.push('/orders')
  }
}

// Update distributor name when distributor is selected
function updateDistributorName() {
  const selectedDistributor = distributors.value.find(d => d.id === form.value.distributorId)
  if (selectedDistributor) {
    form.value.distributorName = selectedDistributor.name
  }
}

// Add new item
function addItem() {
  form.value.items.push({
    name: '',
    quantity: 1,
    unit: '',
    activeIngredient: '',
    formAndStrength: '',
    quantityInWords: '',
    notes: ''
  })
}

// Remove item
function removeItem(index) {
  form.value.items.splice(index, 1)
}

// Save order
async function saveOrder() {
  loading.value = true
  try {
    // Validate form
    if (!form.value.orderNumber || !form.value.distributorId || !form.value.orderDate || form.value.items.length === 0) {
      useToast().add({
        title: 'Validation Error',
        description: 'Please fill in all required fields and add at least one item',
        color: 'red'
      })
      loading.value = false
      return
    }
    
    // Validate items
    for (const item of form.value.items) {
      if (!item.name || !item.quantity || !item.unit) {
        useToast().add({
          title: 'Validation Error',
          description: 'Please fill in all required item fields',
          color: 'red'
        })
        loading.value = false
        return
      }
    }
    
    // Update order
    await orderStore.updateOrder(orderId, form.value)
    
    useToast().add({
      title: 'Success',
      description: 'Order updated successfully',
      color: 'green'
    })
    
    router.push(`/orders/${orderId}`)
  } catch (error) {
    console.error('Error updating order:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to update order',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>