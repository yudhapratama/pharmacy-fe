<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-semibold mb-8">{{ translations.profileManagement }}</h1>

      <div class="flex gap-4 mb-8">
        <UButton
          variant="outline"
          to="/profile/pharmacy"
        >
          {{ translations.pharmacyProfile }}
        </UButton>
        <UButton
          variant="outline"
          to="/profile/account"
          active
        >
          {{ translations.accountSettings }}
        </UButton>
      </div>

      <UCard>
        <div class="space-y-8">
          <div>
            <h2 class="text-xl font-semibold mb-2">{{ translations.accountSettings }}</h2>
            <p class="text-slate-600">{{ translations.manageAccountSettings }}</p>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-4">{{ translations.changePassword }}</h3>
            <form @submit.prevent="changePassword" class="space-y-6 max-w-md">
              <UFormGroup :label="translations.currentPassword">
                <UInput
                  v-model="form.currentPassword"
                  type="password"
                  :placeholder="translations.enterCurrentPassword"
                />
              </UFormGroup>

              <UFormGroup :label="translations.newPassword">
                <UInput
                  v-model="form.newPassword"
                  type="password"
                  :placeholder="translations.enterNewPassword"
                />
              </UFormGroup>

              <UFormGroup :label="translations.confirmNewPassword">
                <UInput
                  v-model="form.confirmPassword"
                  type="password"
                  :placeholder="translations.confirmNewPassword"
                />
              </UFormGroup>

              <div>
                <UButton
                  type="submit"
                  color="black"
                  :loading="changing"
                >
                  {{ translations.changePassword }}
                </UButton>
              </div>
            </form>
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
const toast = useToast()

const changing = ref(false)
const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changePassword = async () => {
  // Validate passwords
  if (!form.value.currentPassword || !form.value.newPassword || !form.value.confirmPassword) {
    toast.add({
      title: translations.error,
      description: translations.allFieldsRequired,
      color: 'red'
    })
    return
  }
  
  if (form.value.newPassword !== form.value.confirmPassword) {
    toast.add({
      title: translations.error,
      description: translations.passwordsDoNotMatch,
      color: 'red'
    })
    return
  }
  
  changing.value = true
  try {
    // TODO: Implement password change
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    toast.add({
      title: translations.success,
      description: translations.passwordChangedSuccessfully,
      color: 'green'
    })
    
    // Reset form
    form.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    toast.add({
      title: translations.error,
      description: error.message || translations.failedToChangePassword,
      color: 'red'
    })
  } finally {
    changing.value = false
  }
}
</script>