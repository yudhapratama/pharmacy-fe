export default defineNuxtPlugin(async (nuxtApp) => {
  // Wait for app to be mounted
  if (process.client) {
    const authStore = useAuthStore()
    nuxtApp.hook('app:mounted', () => {
      authStore.initAuth()
    })
  }
})