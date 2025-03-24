<template>
  <div>
    <UNotifications />
    <NuxtLayout v-if="authStore.isInitialized">
      <NuxtPage />
    </NuxtLayout>
    <div v-else class="flex justify-center items-center min-h-screen">
      <ULoading />
    </div>
  </div>
</template>

<script setup>
// Initialize auth on app load
const authStore = useAuthStore()
const route = useRoute()

// Wait for auth to initialize before rendering
onMounted(async () => {
  await authStore.initAuth()
  
  // If we're on an authenticated route but not authenticated, redirect to login
  if (!authStore.isAuthenticated && route.meta.auth) {
    navigateTo('/login')
  }
  
  // If we're on login page but already authenticated, redirect to dashboard
  if (authStore.isAuthenticated && route.path === '/login') {
    navigateTo('/dashboard')
  }
})
</script>
