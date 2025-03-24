<template>
  <UCard>
    <div class="flex items-center gap-4">
      <div class="p-3 rounded-lg" :class="bgColor">
        <Icon :name="icon" class="w-6 h-6 text-white" />
      </div>
      <div>
        <p class="text-sm text-gray-600">{{ title }}</p>
        <p class="text-2xl font-semibold">{{ value }}</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon: string
  bgColor: string
}>()
</script>