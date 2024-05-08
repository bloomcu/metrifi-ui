<template>
  <main class="flex min-h-screen flex-1">
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-32">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img width="44" src="/logo-mark.svg" alt="MetriFi" />
          <h2 class="mt-8 text-3xl font-medium leading-9 text-gray-900 tracking-tight sm:text-4xl sm:truncate">Sign in</h2>
          <p class="mt-3 leading-6 text-gray-500">
            Don't have an account?
            <RouterLink :to="{ name: 'register' }" class="font-medium leading-6 text-indigo-600 hover:text-indigo-500">Register</RouterLink>
          </p>
        </div>

        <div class="mt-10">
          <form action="#" @submit.prevent="login()" class="w-full">
            <div v-if="errorStore.errors.credentials" class="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-2" role="alert">
              <p>{{ errorStore.errors.credentials[0] }}</p>
            </div>
            
            <div class="flex flex-col gap-4">
              <AppInput v-model="inputs.email" label="Email" required autofocus :errors="errorStore.errors.email" />
              <AppInput v-model="inputs.password" label="Password" type="password" :errors="errorStore.errors.password" required />
              <AppButton :loading="authStore.loading" class="w-full">Sign in with email</AppButton>
            </div>
            
            <p class="mt-6 leading-6 text-gray-500">
              Forgot password?
              <RouterLink :to="{ name: 'forgotPassword' }" class="font-medium leading-6 text-indigo-600 hover:text-indigo-500">Reset password</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80" alt="" />
    </div>
  </main>

  <!-- <main class="py-10 mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
    <form action="#" @submit.prevent="login()">
      <div class="text-center mb-4">
        <h1 class="sm:truncate sm:text-4xl text-3xl font-bold leading-7 text-gray-900 tracking-tight">Log in</h1>
      </div>
      
      <div v-if="errorStore.errors.credentials" class="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-2" role="alert">
        <p>{{ errorStore.errors.credentials[0] }}</p>
      </div>
      
      <div class="flex flex-col gap-3">
        <AppInput v-model="inputs.email" label="Email" required autofocus :errors="errorStore.errors.email" />
        <AppInput v-model="inputs.password" label="Password" type="password" :errors="errorStore.errors.password" required />
        <AppButton :loading="authStore.loading" class="w-full">Login with email</AppButton>
      </div>
      
      <div class="text-center mt-4">
        <p class="text-sm text-gray-500">
          Forgot password?
          <RouterLink :to="{ name: 'forgotPassword' }" class="font-medium leading-6 text-indigo-600 hover:text-indigo-500">Reset password</RouterLink>
        </p>
        <p class="text-sm text-gray-500">
          Don't have an account? 
          <RouterLink :to="{ name: 'register' }" class="font-medium leading-6 text-indigo-600 hover:text-indigo-500">Register</RouterLink>
        </p>
      </div>
    </form>
  </main> -->
</template>

<script setup>
import { ref } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'

const errorStore = useErrorStore()
const authStore = useAuthStore()

const inputs = ref({
  email: '',
  password: ''
})
    
function login() {
  const { email, password } = inputs.value
  authStore.login(email, password)
}
</script>
