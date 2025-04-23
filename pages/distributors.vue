<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-semibold">{{ translations.distributors }}</h1>
        <UButton
          color="black"
          icon="i-heroicons-plus"
          @click="isAddModalOpen = true"
        >
          {{ translations.createDistributor }}
        </UButton>
      </div>

      <!-- Distributors Table -->
      <UTable
        :rows="distributors"
        :columns="columns"
        :loading="loading"
      >
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

      <!-- Add Distributor Modal -->
      <UModal v-model="isAddModalOpen">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900">
                {{ translations.addNewDistributor }}
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="isAddModalOpen = false"
              />
            </div>
          </template>

          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <UFormGroup :label="translations.distributorName" required>
                <UInput v-model="form.name" :placeholder="translations.enterDistributorName" />
              </UFormGroup>

              <UFormGroup :label="translations.email" required>
                <UInput 
                  v-model="form.email" 
                  type="email"
                  :placeholder="translations.enterDistributorEmail" 
                />
              </UFormGroup>

              <UFormGroup :label="translations.distributorPhone" required>
                <UInput 
                  v-model="form.phone" 
                  type="tel"
                  :placeholder="translations.enterDistributorPhone" 
                />
              </UFormGroup>

              <UFormGroup :label="translations.distributorAddress" required>
                <UTextarea v-model="form.address" :placeholder="translations.enterDistributorAddress" />
              </UFormGroup>

              <UFormGroup :label="translations.picName" required>
                <UInput v-model="form.contactPerson" :placeholder="translations.enterPicName" />
              </UFormGroup>
            </div>
          </form>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                color="gray"
                variant="solid"
                @click="isAddModalOpen = false"
              >
                {{ translations.cancel }}
              </UButton>
              <UButton
                color="black"
                :loading="submitting"
                @click="handleSubmit"
              >
                {{ translations.add }}
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>

      <!-- Edit Distributor Modal -->
      <UModal v-model="isEditModalOpen">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900">
                {{ translations.editDistributor }}
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="isEditModalOpen = false"
              />
            </div>
          </template>

          <form @submit.prevent="handleEditSubmit">
            <div class="space-y-4">
              <UFormGroup :label="translations.distributorName" required>
                <UInput v-model="editForm.name" :placeholder="translations.enterDistributorName" />
              </UFormGroup>

              <UFormGroup :label="translations.email" required>
                <UInput 
                  v-model="editForm.email" 
                  type="email"
                  :placeholder="translations.enterDistributorEmail" 
                />
              </UFormGroup>

              <UFormGroup :label="translations.distributorPhone" required>
                <UInput 
                  v-model="editForm.phone" 
                  type="tel"
                  :placeholder="translations.enterDistributorPhone" 
                />
              </UFormGroup>

              <UFormGroup :label="translations.distributorAddress" required>
                <UTextarea v-model="editForm.address" :placeholder="translations.enterDistributorAddress" />
              </UFormGroup>

              <UFormGroup :label="translations.picName" required>
                <UInput v-model="editForm.contactPerson" :placeholder="translations.enterPicName" />
              </UFormGroup>
            </div>
          </form>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                color="gray"
                variant="solid"
                @click="isEditModalOpen = false"
              >
                {{ translations.cancel }}
              </UButton>
              <UButton
                color="black"
                :loading="submitting"
                @click="handleEditSubmit"
              >
                {{ translations.saveChanges }}
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

import { translations } from '~/utils/translations'

// Update columns definition
const columns = [
  {
    key: 'no',
    label: 'No.',
  },
  {
    key: 'name',
    label: translations.distributorName
  },
  {
    key: 'email',
    label: translations.email
  },
  {
    key: 'phone',
    label: translations.distributorPhone
  },
  {
    key: 'address',
    label: translations.distributorAddress
  },
  {
    key: 'contactPerson',
    label: translations.picName
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  }
]

const distributorStore = useDistributorStore()
const toast = useToast()

// Update loading ref to use store's loading state
const loading = computed(() => distributorStore.loading)
const submitting = ref(false)
const isAddModalOpen = ref(false)

// Use store's distributors with computed property for numbering
const distributors = computed(() => {
  console.log('Store distributors:', distributorStore.distributors)
  return distributorStore.distributors.map((dist, index) => ({
    ...dist,
    no: index + 1
  }))
})

// Update onMounted to log the fetch result
onMounted(async () => {
  try {
    console.log('Fetching distributors...')
    await distributorStore.fetchDistributors()
    console.log('Fetch complete, distributors:', distributorStore.distributors)
  } catch (error) {
    console.error('Fetch error:', error)
    toast.add({
      title: translations.error,
      description: translations.failedToLoadDistributors,
      color: 'red'
    })
  }
})

// Form for adding new distributor
const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  contactPerson: ''
})

// Update handleSubmit to use the correct field names
const handleSubmit = async () => {
  submitting.value = true
  try {
    await distributorStore.createDistributor({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      contactPerson: form.value.contactPerson
    })
    
    // Close modal and reset form
    isAddModalOpen.value = false
    form.value = {
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: ''
    }
    
    toast.add({
      title: translations.success,
      description: translations.distributorCreatedSuccessfully,
      color: 'green'
    })
  } catch (error) {
    console.error('Error creating distributor:', error)
    toast.add({
      title: translations.error,
      description: translations.failedToCreateDistributor,
      color: 'red'
    })
  } finally {
    submitting.value = false
  }
}

// Update handleModalClose to use the correct field names
const handleModalClose = () => {
  isAddModalOpen.value = false
  form.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: ''
  }
}

const isEditModalOpen = ref(false)
const editForm = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  contactPerson: ''
})

const handleEdit = (row) => {
  editForm.value = { ...row }
  isEditModalOpen.value = true
}

const handleEditSubmit = async () => {
  submitting.value = true
  try {
    await distributorStore.updateDistributor(editForm.value.id, {
      name: editForm.value.name,
      email: editForm.value.email,
      phone: editForm.value.phone,
      address: editForm.value.address,
      contactPerson: editForm.value.contactPerson
    })
    isEditModalOpen.value = false
    
    toast.add({
      title: translations.success,
      description: translations.distributorUpdatedSuccessfully,
      color: 'green'
    })
  } catch (error) {
    console.error('Error updating distributor:', error)
    toast.add({
      title: translations.error,
      description: translations.failedToUpdateDistributor,
      color: 'red'
    })
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (row) => {
  if (!confirm(translations.confirmDeleteDistributor)) {
    return
  }
  
  try {
    await distributorStore.deleteDistributor(row.id)
    toast.add({
      title: translations.success,
      description: translations.distributorDeletedSuccessfully,
      color: 'green'
    })
  } catch (error) {
    console.error('Error deleting distributor:', error)
    toast.add({
      title: translations.error,
      description: translations.failedToDeleteDistributor,
      color: 'red'
    })
  }
}

// Add this method to handle the action items
const getActionItems = (row) => [
  [
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
  ]
]
</script>