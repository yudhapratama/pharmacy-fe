<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-semibold mb-8">{{ translations.profileManagement }}</h1>

      <div class="flex gap-4 mb-8">
        <UButton
          variant="outline"
          to="/profile/pharmacy"
          active
        >
          {{ translations.pharmacyProfile }}
        </UButton>
        <UButton
          variant="outline"
          to="/profile/account"
        >
          {{ translations.accountSettings }}
        </UButton>
      </div>

      <UCard>
        <div class="space-y-8">
          <div>
            <h2 class="text-xl font-semibold mb-2">{{ translations.pharmacyInformation }}</h2>
            <p class="text-slate-600">{{ translations.updatePharmacyDetails }}</p>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-4">{{ translations.personInCharge }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup :label="translations.picName" required>
                <UInput v-model="form.picName" :placeholder="translations.enterPicName" />
              </UFormGroup>
              <UFormGroup :label="translations.picPhone" required>
                <UInput v-model="form.picPhone" placeholder="e.g. 08123456789" />
              </UFormGroup>
              <UFormGroup :label="translations.picEmail" required class="md:col-span-2">
                <UInput v-model="form.picEmail" type="email" :placeholder="translations.enterPicEmail" />
              </UFormGroup>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-4">{{ translations.pharmacyDetails }}</h3>
            <div class="grid grid-cols-1 gap-6">
              <UFormGroup :label="translations.pharmacyName" required>
                <UInput v-model="form.pharmacyName" :placeholder="translations.enterPharmacyName" />
              </UFormGroup>
              <UFormGroup :label="translations.pharmacyAddress" required>
                <UTextarea v-model="form.pharmacyAddress" :placeholder="translations.enterPharmacyAddress" />
              </UFormGroup>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-4">{{ translations.licenseInformation }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup :label="translations.pharmacistName" required>
                <UInput v-model="form.pharmacistName" :placeholder="translations.enterPharmacistName" />
              </UFormGroup>
              <UFormGroup label="SIPA" required>
                <UInput v-model="form.sipa" :placeholder="translations.enterSipaNumber" />
              </UFormGroup>
              <UFormGroup :label="translations.siaNumber" required>
                <UInput v-model="form.sia" :placeholder="translations.enterSiaNumber" />
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
              {{ saving ? translations.saving : translations.saveChanges }}
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

import { translations } from '~/utils/translations'

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
      title: translations.success,
      description: translations.profileUpdatedSuccessfully,
      color: 'green'
    })
  } catch (error) {
    console.error('Profile update error:', error)
    toast.add({
      title: translations.error,
      description: error.message || translations.failedToUpdateProfile,
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