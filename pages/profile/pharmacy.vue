<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-semibold mb-8">Profile Management</h1>

      <div class="flex gap-4 mb-8">
        <UButton
          variant="outline"
          to="/profile/pharmacy"
          active
        >
          Pharmacy Profile
        </UButton>
        <UButton
          variant="outline"
          to="/profile/account"
        >
          Account Settings
        </UButton>
      </div>

      <UCard>
        <div class="space-y-8">
          <div>
            <h2 class="text-xl font-semibold mb-2">Pharmacy Information</h2>
            <p class="text-slate-600">Update your pharmacy details. This information will be used for orders and invoices.</p>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-4">Person in Charge (PIC)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="PIC Name" required>
                <UInput v-model="form.picName" placeholder="Enter PIC name" />
              </UFormGroup>
              <UFormGroup label="PIC Phone Number" required>
                <UInput v-model="form.picPhone" placeholder="e.g. 08123456789" />
              </UFormGroup>
              <UFormGroup label="PIC Email" required class="md:col-span-2">
                <UInput v-model="form.picEmail" type="email" placeholder="Enter PIC email" />
              </UFormGroup>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-4">Pharmacy Details</h3>
            <div class="grid grid-cols-1 gap-6">
              <UFormGroup label="Pharmacy Name" required>
                <UInput v-model="form.pharmacyName" placeholder="Enter pharmacy name" />
              </UFormGroup>
              <UFormGroup label="Pharmacy Address" required>
                <UTextarea v-model="form.pharmacyAddress" placeholder="Enter pharmacy address" />
              </UFormGroup>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-4">License Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="Pharmacist Name" required>
                <UInput v-model="form.pharmacistName" placeholder="Enter pharmacist name" />
              </UFormGroup>
              <UFormGroup label="SIPA" required>
                <UInput v-model="form.sipa" placeholder="Enter SIPA number" />
              </UFormGroup>
              <UFormGroup label="SIA" required>
                <UInput v-model="form.sia" placeholder="Enter SIA number" />
              </UFormGroup>
            </div>
          </div>

          <div class="flex justify-start">
            <UButton
              color="black"
              :loading="saving"
              :disabled="saving"
              @click="saveChanges"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'authenticated',
  middleware: ['auth']
})

const profileStore = useProfileStore()
const toast = useToast()
const saving = ref(false)

// Initialize form with profile data
const form = ref({
  picName: '',
  picPhone: '',
  picEmail: '',
  pharmacyName: '',
  pharmacyAddress: '',
  pharmacistName: '',
  sipa: '',
  sia: ''
})

// Initialize profile from auth data if needed
onMounted(() => {
  if (!profileStore.profile) {
    profileStore.initFromAuth()
  }
  
  // Populate form with profile data
  if (profileStore.profile) {
    form.value = { ...profileStore.profile }
  }
})

const saveChanges = async () => {
  saving.value = true
  try {
    console.log('Saving profile data:', form.value)
    await profileStore.updateProfile(form.value)
    toast.add({
      title: 'Success',
      description: 'Profile updated successfully',
      color: 'green'
    })
  } catch (error) {
    console.error('Profile update error:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to update profile',
      color: 'red'
    })
  } finally {
    // Add a small delay to ensure the loading state is visible
    setTimeout(() => {
      saving.value = false
    }, 500)
  }
}
</script>