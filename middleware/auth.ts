export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Wait for auth to be initialized
  while (!authStore.isInitialized) {
    await new Promise(resolve => setTimeout(resolve, 10))
  }

  // Public routes
  if (to.path === '/login') {
    if (authStore.isAuthenticated) {
      return navigateTo('/dashboard')
    }
    return
  }

  // Protected routes
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})