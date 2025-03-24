<template>
  <div class="flex justify-center items-center min-h-screen">
    <USpinner v-if="loading" />
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(true)

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await router.push('/login')
  } else {
    await router.push('/dashboard')
  }
  loading.value = false
})
</script>