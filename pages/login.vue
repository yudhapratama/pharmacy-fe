<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-50">
    <div class="w-full max-w-5xl grid grid-cols-2 gap-16">
      <!-- Login Form Section -->
      <div class="bg-white rounded-3xl p-8 shadow-sm">
        <div class="space-y-2 mb-8 text-center">
          <h1 class="text-4xl font-medium text-slate-900">Welcome back</h1>
          <p class="text-base text-slate-500">Enter your credentials to access your account</p>
        </div>

        <UForm 
          :state="form"
          :rules="rules"
          @submit="handleLogin" 
          class="space-y-6"
        >
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="text-sm font-medium text-slate-700">Email</label>
            </div>
            <UInput
              v-model="form.email"
              placeholder="you@example.com"
              type="email"
              class="h-14"
              :ui="{
                base: 'bg-white border-2 border-slate-200 rounded-2xl',
                input: 'text-slate-600 placeholder:text-slate-400'
              }"
            />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="text-sm font-medium text-slate-700">Password</label>
            </div>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="h-14"
              :ui="{
                base: 'bg-white border-2 border-slate-200 rounded-2xl',
                input: 'text-slate-600 placeholder:text-slate-400'
              }"
            />
          </div>

          <!-- Show form-level error if exists -->
          <p v-if="errors.form" class="text-sm text-red-500 mt-2">
            {{ errors.form }}
          </p>

          <UButton
            type="submit"
            block
            class="h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium"
            :loading="isLoading"
          >
            Sign In
          </UButton>
        </UForm>
      </div>

      <!-- Info Section -->
      <div class="flex flex-col justify-center">
        <div class="space-y-4 mb-8">
          <h2 class="text-slate-900 text-3xl font-bold">
            {{ $config.public.appName }}
          </h2>
          <p class="text-slate-500">
            A streamlined solution for pharmacies to manage medication orders from distributors efficiently.
          </p>
        </div>

        <div class="space-y-1 text-sm">
          <p class="text-slate-500">For demo purposes, use:</p>
          <p class="font-mono">Email: <span class="text-slate-900">admin@example.com</span></p>
          <p class="font-mono">Password: <span class="text-slate-900">Password123!</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})
const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({})
const isLoading = ref(false)

const rules = {
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email address' }
  ],
  password: [
    { required: true, message: 'Password is required' },
    { min: 8, message: 'Password must be at least 8 characters' }
  ]
}

const handleLogin = async () => {
  try {
    errors.value = {}
    isLoading.value = true
    
    await authStore.login(form.value.email, form.value.password)
    router.push('/dashboard')
  } catch (error) {
    errors.value = {
      form: error?.message || 'Invalid credentials'
    }
  } finally {
    isLoading.value = false
  }
}
</script>