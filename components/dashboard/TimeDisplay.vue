<template>
  <div class="space-y-1">
    <h2 class="text-2xl font-semibold">Dashboard</h2>
    <div class="text-slate-500">
      Current Time
      <p class="text-xl font-medium text-slate-900">{{ formattedTime }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentTime = ref(new Date())

const formattedTime = computed(() => {
  return currentTime.value.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

let timer: NodeJS.Timer
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>