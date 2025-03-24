<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-semibold mb-8">Profile Management</h1>

      <div class="flex gap-4 mb-8">
        <UButton
          variant="outline"
          to="/profile/pharmacy"
        >
          Pharmacy Profile
        </UButton>
        <UButton
          variant="outline"
          to="/profile/account"
          active
        >
          Account Settings
        </UButton>
      </div>

      <UCard>
        <div class="space-y-8">
          <div>
            <h2 class="text-xl font-semibold mb-2">Account Settings</h2>
            <p class="text-slate-600">Manage your account settings and change your password.</p>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-4">Change Password</h3>
            <form @submit.prevent="changePassword" class="space-y-6 max-w-md">
              <UFormGroup label="Current Password">
                <UInput
                  v-model="form.currentPassword"
                  type="password"
                  placeholder="Enter current password"
                />
              </UFormGroup>

              <UFormGroup label="New Password">
                <UInput
                  v-model="form.newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </UFormGroup>

              <UFormGroup label="Confirm New Password">
                <UInput
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </UFormGroup>

              <div>
                <UButton
                  type="submit"
                  color="black"
                  :loading="changing"
                >
                  Change Password
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

const changing = ref(false)
const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changePassword = async () => {
  changing.value = true
  try {
    // TODO: Implement password change
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    changing.value = false
  }
}
</script>