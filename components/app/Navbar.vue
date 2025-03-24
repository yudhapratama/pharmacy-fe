<template>
  <div class="border-b bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center gap-8">
          <h1 class="text-xl font-medium">{{ $config.public.appName }}</h1>
          <nav class="flex items-center gap-6">
            <UButton
              v-for="item in navItems"
              :key="item.path"
              variant="ghost"
              :to="item.path"
              :active="isActiveRoute(item.path)"
              :icon="item.icon"
            >
              {{ item.label }}
            </UButton>
          </nav>
        </div>

        <div class="flex items-center gap-4">


          <!-- User Profile Dropdown -->
          <UDropdown
            :items="profileMenuItems"
            :popper="{ placement: 'bottom-end' }"
          >
            <UButton
              variant="ghost"
              class="flex items-center gap-2"
            >
              <UAvatar
                :src="userAvatarUrl"
                :alt="authStore.user?.name"
                size="sm"
              />
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium">{{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-500">{{ authStore.user?.pharmacy_name }}</p>
              </div>
              <Icon name="i-heroicons-chevron-down" class="w-4 h-4" />
            </UButton>

            <template #account>
              <div class="px-4 py-3 border-b">
                <p class="text-sm font-medium">{{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
              </div>
            </template>
          </UDropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const authStore = useAuthStore()
const router = useRouter()

// Helper function to determine if a route is active
const isActiveRoute = (path) => {
  if (path === '/orders') {
    return route.path.startsWith('/orders')
  }
  return route.path === path
}

// Navigation items
const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'i-heroicons-squares-2x2'
  },
  {
    label: 'Distributors',
    path: '/distributors',
    icon: 'i-heroicons-building-storefront'
  },
  {
    label: 'Orders',
    path: '/orders',
    icon: 'i-heroicons-clipboard-document-list'
  }
]

// Profile dropdown items
// Update the profileMenuItems computed property
const profileMenuItems = computed(() => [
  [
    {
      label: 'Pharmacy Profile',
      icon: 'i-heroicons-building-office-2',
      description: authStore.user?.pharmacy_name,
      to: '/profile/pharmacy'
    },
    {
      label: 'Account Settings',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/profile/account'
    }
  ],
  [
    {
      label: 'Sign Out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => {  // Change from onClick to click
        console.log('Sign out clicked')
        return authStore.logout()
      }
    }
  ]
])

// Placeholder for notifications (to be implemented)
const notificationCount = ref(0)

// Generate avatar URL from name
const userAvatarUrl = computed(() => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.name || '')}&background=random`
})
</script>