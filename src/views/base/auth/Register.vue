<template>
  <main class="flex min-h-screen flex-1">
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-32">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img class="h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 class="mt-8 text-3xl font-medium leading-9 text-gray-900 tracking-tight sm:text-4xl sm:truncate">Register</h2>
          <p class="mt-3 leading-6 text-gray-500">
            Already have an account?
            <RouterLink :to="{ name: 'login' }" class="font-medium leading-6 text-indigo-600 hover:text-indigo-500">Log in</RouterLink>
          </p>
        </div>

        <div class="mt-10">
          <form action="#" @submit.prevent="register()">
            <div v-if="errorStore.errors.credentials" class="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-2" role="alert">
              <p>{{ errorStore.errors.credentials[0] }}</p>
            </div>
            
            <div class="flex flex-col gap-4">
              <AppInput v-model="inputs.name" label="Full name" :errors="errorStore.errors.name" required autofocus />
              <AppInput v-model="inputs.email" label="Email" :errors="errorStore.errors.email" required />
              <AppInput v-model="inputs.organization_title" label="Organization Title" :errors="errorStore.errors.organization_title" required />
              <AppInput v-model="inputs.password" :errors="errorStore.errors.password" type="password" label="Password" required />
              <AppInput v-model="inputs.password_confirmation" type="password" label="Confirm Password" required />
              <AppPasswordChecker v-if="inputs.password" :password="inputs.password"/>
              <AppButton :loading="authStore.loading" class="w-full">Register with email</AppButton>
            </div>
            
            <p class="mt-6 leading-6 text-gray-500">
              Already have an account? 
              <RouterLink :to="{ name: 'login' }" class="font-medium leading-6 text-indigo-600 hover:text-indigo-500">Log in</RouterLink>
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
    <form action="#" @submit.prevent="register()">
      <div class="text-center mb-4">
        <h1 class="text-3xl font-bold leading-7 text-gray-900 tracking-tight sm:text-4xl sm:truncate">Register</h1>
      </div>

      <div v-if="errorStore.errors.credentials" class="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-2" role="alert">
        <p>{{ errorStore.errors.credentials[0] }}</p>
      </div>
      
      <div class="flex flex-col gap-3">
        <AppInput v-model="inputs.name" label="Full name" :errors="errorStore.errors.name" required autofocus />
        <AppInput v-model="inputs.email" label="Email" :errors="errorStore.errors.email" required />
        <AppInput v-model="inputs.organization_title" label="Organization Title" :errors="errorStore.errors.organization_title" required />
        <AppInput v-model="inputs.password" :errors="errorStore.errors.password" type="password" label="Password" required />
        <AppInput v-model="inputs.password_confirmation" type="password" label="Confirm Password" required />
        <AppPasswordChecker v-if="inputs.password" :password="inputs.password"/>
        <AppButton :loading="authStore.loading" class="w-full">Register with email</AppButton>
      </div>
      
      <div class="text-center mt-4">
        <p class="text-sm text-gray-500">
          Already have an account? 
          <RouterLink :to="{ name: 'login' }" class="font-medium leading-6 text-indigo-600 hover:text-indigo-500">Log in</RouterLink>
        </p>
      </div>
    </form>
  </main> -->
</template>

<script setup>
import { ref } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import AppPasswordChecker from '@/app/components/base/forms/AppPasswordChecker.vue'

const errorStore = useErrorStore()
const authStore = useAuthStore()

const inputs = ref({
  name: '',
  email: '',
  organization_title: '',
  password: '',
  password_confirmation: ''
})

function register() {
  const { name, email, organization_title, password, password_confirmation } = inputs.value
  authStore.register(name, email, organization_title, password, password_confirmation)
}
</script>
