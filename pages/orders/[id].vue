<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-semibold">{{ translations.orderDetails }}</h1>
          <p class="text-gray-500">{{ order?.orderNumber }}</p>
        </div>
        <!-- In the header section of your details page -->
        <div class="flex gap-2">
          <UButton
            color="gray"
            variant="solid"
            icon="i-heroicons-arrow-left"
            @click="router.push('/orders')"
          >
            {{ translations.backToOrders }}
          </UButton>
          <UButton
            v-if="order?.status === 'draft'"
            color="blue"
            icon="i-heroicons-paper-airplane"
            @click="handlePublish"
          >
            {{ translations.publish }}
          </UButton>
          <UButton
            v-if="order?.status === 'published'"
            color="green"
            icon="i-heroicons-check"
            @click="handleComplete"
          >
            {{ translations.markAsCompleted }}
          </UButton>
          <UButton
            v-if="order?.status === 'draft'"
            color="red"
            icon="i-heroicons-trash"
            @click="handleDelete"
          >
            {{ translations.delete }}
          </UButton>
          <UButton
            color="black"
            icon="i-heroicons-document-arrow-down"
            @click="handleExport"
          >
            {{ translations.exportPDF }}
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
              <h3 class="text-sm font-medium text-gray-500">{{ translations.orderInformation }}</h3>
              <div class="mt-2">
                <p class="text-sm"><span class="font-medium">{{ translations.status }}:</span> 
                  <UBadge :color="getStatusColor(order.status)">
                    {{ formatStatus(order.status) }}
                  </UBadge>
                </p>
                <p class="text-sm mt-1"><span class="font-medium">{{ translations.orderType }}:</span> 
                  <UBadge :color="getOrderTypeColor(order.orderType)">
                    {{ formatOrderType(order.orderType) }}
                  </UBadge>
                </p>
                <p class="text-sm mt-1"><span class="font-medium">{{ translations.orderDate }}:</span> {{ formatDate(order.orderDate) }}</p>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ translations.distributor }}</h3>
              <div class="mt-2">
                <p class="text-sm font-medium">{{ order.distributorName }}</p>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">{{ translations.created }}</h3>
              <div class="mt-2">
                <p class="text-sm">{{ formatDate(order.createdAt) }}</p>
                <p class="text-sm mt-1" v-if="order.updatedAt !== order.createdAt">
                  <span class="font-medium">{{ translations.lastUpdated }}:</span> {{ formatDate(order.updatedAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">{{ translations.orderItems }}</h3>
            <UButton 
              v-if="order.status === 'draft'"
              size="sm" 
              icon="i-heroicons-plus" 
              @click="addNewItem"
            >
              {{ translations.addItem }}
            </UButton>
          </div>
          
          <div v-for="(item, index) in order.items" :key="index" class="mb-4 border rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p v-if="item.activeIngredient" class="text-sm text-gray-500">
                  {{ translations.activeIngredient }}: {{ item.activeIngredient }}
                </p>
                <p v-if="item.formAndStrength" class="text-sm text-gray-500">
                  {{ translations.formAndStrength }}: {{ item.formAndStrength }}
                </p>
              </div>
              <div class="flex gap-2" v-if="order.status === 'draft'">
                <UButton 
                  v-if="!item.editing" 
                  size="xs" 
                  variant="ghost" 
                  icon="i-heroicons-pencil" 
                  @click="startEditing(item)"
                />
                <UButton 
                  v-if="item.editing" 
                  size="xs" 
                  variant="ghost" 
                  color="green" 
                  icon="i-heroicons-check" 
                  @click="saveItem(item)"
                />
                <UButton 
                  v-if="item.editing" 
                  size="xs" 
                  variant="ghost" 
                  color="gray" 
                  icon="i-heroicons-x-mark" 
                  @click="cancelEditing(item)"
                />
                <UButton 
                  size="xs" 
                  variant="ghost" 
                  color="red" 
                  icon="i-heroicons-trash" 
                  @click="removeItem(index)"
                />
              </div>
            </div>
            
            <div v-if="!item.editing">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p class="text-sm text-gray-500">{{ translations.quantity }}:</p>
                  <p>{{ item.quantity }} {{ item.unit }}</p>
                  <p v-if="item.quantityInWords" class="text-sm text-gray-500">
                    {{ item.quantityInWords }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">{{ translations.notes }}:</p>
                  <p v-if="item.notes">{{ item.notes }}</p>
                  <p v-else class="text-gray-400">-</p>
                </div>
              </div>
            </div>
            
            <div v-else class="mt-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup :label="translations.itemName" required>
                  <UInput v-model="item.name" :placeholder="translations.enterItemName" />
                </UFormGroup>
                
                <div class="grid grid-cols-2 gap-2">
                  <UFormGroup :label="translations.quantity" required>
                    <UInput v-model.number="item.quantity" type="number" min="1" />
                  </UFormGroup>
                  
                  <UFormGroup :label="translations.unit" required>
                    <UInput v-model="item.unit" :placeholder="translations.enterUnit" />
                  </UFormGroup>
                </div>
                
                <UFormGroup :label="translations.activeIngredient">
                  <UInput v-model="item.activeIngredient" :placeholder="translations.enterActiveIngredient" />
                </UFormGroup>
                
                <UFormGroup :label="translations.formAndStrength">
                  <UInput v-model="item.formAndStrength" :placeholder="translations.enterFormAndStrength" />
                </UFormGroup>
                
                <UFormGroup :label="translations.quantityInWords" class="md:col-span-2">
                  <UInput v-model="item.quantityInWords" :placeholder="translations.enterQuantityInWords" />
                </UFormGroup>
                
                <UFormGroup :label="translations.notes" class="md:col-span-2">
                  <UTextarea v-model="item.notes" :placeholder="translations.additionalNotes" />
                </UFormGroup>
              </div>
            </div>
          </div>
          
          <div v-if="order.items.length === 0" class="text-center py-8 border border-dashed rounded-lg">
            <p class="text-gray-500">{{ translations.noItemsAddedYet }}</p>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 mx-auto text-yellow-500" />
        <h3 class="mt-4 text-lg font-medium">{{ translations.orderNotFound }}</h3>
        <p class="mt-2 text-gray-500">{{ translations.orderNotFoundDescription }}</p>
        <UButton class="mt-6" @click="router.push('/orders')">
          {{ translations.backToOrders }}
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

import { useOrderService } from '~/services/order.service'
import { useProfileStore } from '~/stores/profile'
import { translations } from '~/utils/translations'

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
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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

const formatStatus = (status) => {
  switch (status) {
    case 'draft': return translations.draft
    case 'published': return translations.published
    case 'completed': return translations.completed
    default: return status.charAt(0).toUpperCase() + status.slice(1)
  }
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
      title: translations.success,
      description: translations.orderPublishedSuccessfully,
      color: 'green'
    })
  } catch (error) {
    console.error('Error publishing order:', error)
    toast.add({
      title: translations.error,
      description: translations.failedToPublishOrder,
      color: 'red'
    })
  }
}

const handleComplete = async () => {
  try {
    await orderStore.updateOrderStatus(order.value.id, 'completed')
    order.value.status = 'completed'
    toast.add({
      title: translations.success,
      description: translations.orderCompletedSuccessfully,
      color: 'green'
    })
  } catch (error) {
    console.error('Error completing order:', error)
    toast.add({
      title: translations.error,
      description: translations.failedToCompleteOrder,
      color: 'red'
    })
  }
}

const handleDelete = async () => {
  if (!confirm(translations.confirmDeleteOrder)) {
    return
  }
  
  try {
    await orderStore.deleteOrder(order.value.id)
    toast.add({
      title: translations.success,
      description: translations.orderDeletedSuccessfully,
      color: 'green'
    })
    router.push('/orders')
  } catch (error) {
    console.error('Error deleting order:', error)
    toast.add({
      title: translations.error,
      description: translations.failedToDeleteOrder,
      color: 'red'
    })
  }
}

const handleExport = async () => {
  try {

    const orderService = useOrderService()
    const profileStore = useProfileStore()
    
    // Initialize profile from auth data if needed - similar to pharmacy.vue
    if (!profileStore.profile) {
      profileStore.initFromAuth()
    }
    
    // Get pharmacy profile data from the store
    const pharmacyProfile = profileStore.profile || {
      pharmacyName: 'Trial',
      address: 'Default Address',
      picName: 'Pharmacist',
      picLicenseNumber: '000000',
      siaNumber: '000000'
    }
    
    // Map profile data to the format expected by the PDF generator
    const exportData = {
      order: order.value,
      pharmacy: {
        pharmacyName: pharmacyProfile.pharmacyName,
        address: pharmacyProfile.pharmacyAddress,
        picName: pharmacyProfile.pharmacistName || pharmacyProfile.picName,
        picLicenseNumber: pharmacyProfile.sipa,
        siaNumber: pharmacyProfile.sia
      },
      exportDate: new Date().toISOString()
    }
    
    const blob = await orderService.exportOrderPdf(order.value.id, exportData)
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob)
    
    // Create a link element
    const link = document.createElement('a')
    link.href = url
    link.download = `surat-pesanan-${order.value.orderNumber}.pdf`
    
    // Append to the document and trigger the download
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast.add({
      title: 'Export Success',
      description: 'Order has been exported as PDF',
      color: 'green'
    })
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

const handleEdit = () => {
  console.log('Edit button clicked, navigating to:', `/orders/${order.value.id}/edit`)
  // Use navigateTo instead of router.push for more reliable navigation
  navigateTo(`/orders/${order.value.id}/edit`)
}

// Add these functions for inline editing
function startEditing(item) {
  // Save original values in case user cancels
  item._original = JSON.parse(JSON.stringify(item));
  item.editing = true;
}

function cancelEditing(item) {
  // Restore original values
  Object.keys(item._original).forEach(key => {
    if (key !== '_original' && key !== 'editing') {
      item[key] = item._original[key];
    }
  });
  delete item._original;
  item.editing = false;
}

async function saveItem(item) {
  try {
    // Validate item
    if (!item.name || !item.quantity || !item.unit) {
      toast.add({
        title: 'Validation Error',
        description: 'Please fill in all required item fields',
        color: 'red'
      });
      return;
    }
    
    // Remove temporary properties
    delete item._original;
    item.editing = false;
    
    // Update the order with the modified items
    await orderStore.updateOrder(order.value.id, {
      ...order.value,
      items: order.value.items
    });
    
    toast.add({
      title: 'Success',
      description: 'Item updated successfully',
      color: 'green'
    });
  } catch (error) {
    console.error('Error updating item:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to update item',
      color: 'red'
    });
  }
}

async function removeItem(index) {
  if (confirm(translations.confirmRemoveItem)) {
    try {
      order.value.items.splice(index, 1);
      
      // Update the order with the modified items
      await orderStore.updateOrder(order.value.id, {
        ...order.value,
        items: order.value.items
      });
      
      toast.add({
        title: translations.success,
        description: translations.itemRemovedSuccessfully,
        color: 'green'
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast.add({
        title: translations.error,
        description: translations.failedToRemoveItem,
        color: 'red'
      });
    }
  }
}

function addNewItem() {
  const newItem = {
    name: '',
    quantity: 1,
    unit: '',
    activeIngredient: '',
    formAndStrength: '',
    quantityInWords: '',
    notes: '',
    editing: true
  };
  
  order.value.items.push(newItem);
}
</script>