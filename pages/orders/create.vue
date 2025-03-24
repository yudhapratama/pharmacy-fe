<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-semibold">Create New Order</h1>
        <UButton
          color="gray"
          variant="solid"
          icon="i-heroicons-arrow-left"
          @click="router.push('/orders')"
        >
          Back to Orders
        </UButton>
      </div>

      <!-- Order Form -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-lg font-medium">Order Information</h2>
        </div>

        <div class="p-6">
          <form @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Distributor Selection -->
              <UFormGroup label="Distributor" required>
                <USelect
                  v-model="form.distributorId"
                  :options="distributorOptions"
                  placeholder="Select distributor"
                />
              </UFormGroup>

              <!-- Order Type -->
              <UFormGroup label="Order Type" required>
                <USelect
                  v-model="form.orderType"
                  :options="orderTypeOptions"
                  placeholder="Select order type"
                />
              </UFormGroup>

              <!-- Order Date -->
              <UFormGroup label="Order Date" required>
                <UInput
                  v-model="form.orderDate"
                  type="date"
                />
              </UFormGroup>

              <!-- Order Status -->
              <UFormGroup label="Status" required>
                <USelect
                  v-model="form.status"
                  :options="statusOptions"
                  placeholder="Select status"
                />
              </UFormGroup>
            </div>

            <!-- Order Items -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-base font-medium">Order Items</h3>
                <UButton
                  color="gray"
                  variant="solid"
                  icon="i-heroicons-plus"
                  @click="addOrderItem"
                >
                  Add Item
                </UButton>
              </div>

              <div v-if="form.items.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
                <p class="text-gray-500">No items added yet. Click "Add Item" to start.</p>
              </div>

              <div v-else class="space-y-4">
                <div 
                  v-for="(item, index) in form.items" 
                  :key="index"
                  class="p-4 border rounded-lg"
                >
                  <div class="flex justify-between items-start mb-4">
                    <h4 class="text-sm font-medium">Item #{{ index + 1 }}</h4>
                    <UButton
                      color="red"
                      variant="ghost"
                      icon="i-heroicons-trash"
                      size="xs"
                      @click="removeOrderItem(index)"
                    />
                  </div>

                  <!-- Regular Order Form -->
                  <div v-if="form.orderType === 'regular'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <UFormGroup label="Drug Name" required>
                      <UInput v-model="item.name" placeholder="Enter drug name" />
                    </UFormGroup>
                    <UFormGroup label="Quantity" required>
                      <UInput v-model="item.quantity" type="number" min="1" placeholder="Enter quantity" />
                    </UFormGroup>
                    <UFormGroup label="Unit" required>
                      <UInput v-model="item.unit" placeholder="e.g., Box, Strip" />
                    </UFormGroup>
                  </div>

                  <!-- OOT Order Form -->
                  <div v-else-if="form.orderType === 'oot'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UFormGroup label="Drug Name" required>
                      <UInput v-model="item.name" placeholder="Enter drug name" />
                    </UFormGroup>
                    <UFormGroup label="Active Ingredient" required>
                      <UInput v-model="item.activeIngredient" placeholder="Enter active ingredient" />
                    </UFormGroup>
                    <UFormGroup label="Form and Strength" required>
                      <UInput v-model="item.formAndStrength" placeholder="e.g., Tablet 500mg" />
                    </UFormGroup>
                    <UFormGroup label="Unit" required>
                      <UInput v-model="item.unit" placeholder="e.g., Box, Strip" />
                    </UFormGroup>
                    <UFormGroup label="Quantity" required>
                      <UInput v-model="item.quantity" type="number" min="1" placeholder="Enter quantity" />
                    </UFormGroup>
                    <UFormGroup label="Quantity in Words" required>
                      <UInput v-model="item.quantityInWords" placeholder="e.g., One hundred" />
                    </UFormGroup>
                    <UFormGroup label="Notes" class="md:col-span-2">
                      <UTextarea v-model="item.notes" placeholder="Additional notes" />
                    </UFormGroup>
                  </div>

                  <!-- Prekursor Order Form -->
                  <div v-else-if="form.orderType === 'prekursor'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UFormGroup label="Drug Name with Precursor" required>
                      <UInput v-model="item.name" placeholder="Enter drug name" />
                    </UFormGroup>
                    <UFormGroup label="Active Precursor Ingredient" required>
                      <UInput v-model="item.activeIngredient" placeholder="Enter active precursor" />
                    </UFormGroup>
                    <UFormGroup label="Form and Strength" required>
                      <UInput v-model="item.formAndStrength" placeholder="e.g., Tablet 500mg" />
                    </UFormGroup>
                    <UFormGroup label="Unit" required>
                      <UInput v-model="item.unit" placeholder="e.g., Box, Strip" />
                    </UFormGroup>
                    <UFormGroup label="Quantity" required>
                      <UInput v-model="item.quantity" type="number" min="1" placeholder="Enter quantity" />
                    </UFormGroup>
                    <UFormGroup label="Quantity in Words" required>
                      <UInput v-model="item.quantityInWords" placeholder="e.g., One hundred" />
                    </UFormGroup>
                    <UFormGroup label="Notes" class="md:col-span-2">
                      <UTextarea v-model="item.notes" placeholder="Additional notes" />
                    </UFormGroup>
                  </div>

                  <!-- Placeholder for other order types -->
                  <div v-else class="text-center py-4">
                    <p class="text-gray-500">Form for {{ form.orderType }} will be available soon.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <UButton
                color="gray"
                variant="solid"
                @click="router.push('/orders')"
              >
                Cancel
              </UButton>
              <UButton
                color="black"
                type="submit"
                :loading="submitting"
              >
                Create Order
              </UButton>
            </div>
          </form>
        </div>
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
const orderStore = useOrderStore()
const distributorStore = useDistributorStore()
const submitting = ref(false)
const toast = useToast()

// Form data
const form = ref({
  distributorId: '',
  orderType: 'regular',
  orderDate: new Date().toISOString().split('T')[0],
  status: 'draft',
  items: []
})

// Options for selects
const distributorOptions = computed(() => {
  return distributorStore.distributors.map(dist => ({
    label: dist.name,
    value: dist.id
  }))
})

const orderTypeOptions = [
  { label: 'Regular', value: 'regular' },
  { label: 'OOT (Obat-Obat Tertentu)', value: 'oot' },
  { label: 'Prekursor', value: 'prekursor' },
  { label: 'Psikotropika', value: 'psikotropika', disabled: true },
  { label: 'Narkotika', value: 'narkotika', disabled: true }
]

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' }
]

// Methods
const addOrderItem = () => {
  const newItem = {
    name: '',
    quantity: 1,
    unit: '',
    activeIngredient: '',
    formAndStrength: '',
    quantityInWords: '',
    notes: ''
  }
  
  form.value.items.push(newItem)
}

const removeOrderItem = (index) => {
  form.value.items.splice(index, 1)
}

const validateForm = () => {
  const { distributorId, orderType, orderDate, status, items } = form.value
  
  if (!distributorId || !orderType || !orderDate || !status) {
    return false
  }
  
  if (items.length === 0) {
    return false
  }
  
  // Validate items based on order type
  for (const item of items) {
    if (!item.name || !item.quantity || !item.unit) {
      return false
    }
    
    if (orderType === 'oot' || orderType === 'prekursor') {
      if (!item.activeIngredient || !item.formAndStrength || !item.quantityInWords) {
        return false
      }
    }
  }
  
  return true
}

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
    // Generate order number if not provided by backend
    const orderNumber = `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    
    // Get distributor name
    const distributor = distributorStore.distributors.find(d => d.id === form.value.distributorId)
    
    const orderData = {
      ...form.value,
      orderNumber,
      distributorName: distributor?.name
    }
    
    await orderStore.createOrder(orderData)
    
    // Redirect to order list
    router.push('/orders')
    
    toast.add({
      id: 'order-success',
      title: 'Success',
      description: 'Order created successfully',
      color: 'green',
      timeout: 5000
    })
  } catch (error) {
    console.error('Error creating order:', error)
    toast.add({
      id: 'order-error',
      title: 'Error',
      description: 'Failed to create order. Please try again.',
      color: 'red',
      timeout: 5000
    })
  } finally {
    submitting.value = false
  }
}

// Helper function to convert number to words (Indonesian)
const numberToWords = (num) => {
  const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']
  const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas']
  const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh']
  
  if (num === 0) return 'nol'
  
  const convertLessThanOneThousand = (num) => {
    if (num === 0) return ''
    
    if (num < 10) return units[num]
    
    if (num < 20) return teens[num - 10]
    
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '')
    }
    
    return units[Math.floor(num / 100)] + ' ratus' + (num % 100 !== 0 ? ' ' + convertLessThanOneThousand(num % 100) : '')
  }
  
  if (num < 1000) {
    return convertLessThanOneThousand(num)
  }
  
  if (num < 1000000) {
    return (num < 2000 ? 'seribu' : convertLessThanOneThousand(Math.floor(num / 1000)) + ' ribu') + 
      (num % 1000 !== 0 ? ' ' + convertLessThanOneThousand(num % 1000) : '')
  }
  
  if (num < 1000000000) {
    return convertLessThanOneThousand(Math.floor(num / 1000000)) + ' juta' + 
      (num % 1000000 !== 0 ? ' ' + convertLessThanOneThousand(Math.floor((num % 1000000) / 1000)) + ' ribu' : '') +
      (num % 1000 !== 0 ? ' ' + convertLessThanOneThousand(num % 1000) : '')
  }
  
  return 'number too large'
}

// Auto-generate quantity in words when quantity changes for OOT and Prekursor
watch(() => form.value.items, (newItems) => {
  if (form.value.orderType === 'oot' || form.value.orderType === 'prekursor') {
    newItems.forEach(item => {
      if (item.quantity && !isNaN(item.quantity)) {
        item.quantityInWords = numberToWords(parseInt(item.quantity))
      }
    })
  }
}, { deep: true })

// Fetch distributors on mount
onMounted(async () => {
  try {
    await distributorStore.fetchDistributors()
    
    // Add first item by default
    if (form.value.items.length === 0) {
      addOrderItem()
    }
  } catch (error) {
    console.error('Error fetching distributors:', error)
    toast.add({
      id: 'fetch-error',
      title: 'Error',
      description: 'Failed to load distributors',
      color: 'red',
      timeout: 5000
    })
  }
})

// Watch for order type changes to reset items
watch(() => form.value.orderType, () => {
  form.value.items = []
  addOrderItem()
})
</script>