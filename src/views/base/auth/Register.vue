<template>
  <main class="flex min-h-screen flex-1">
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-32">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img width="140" src="/logo.svg" alt="MetriFi" class="mb-20"/>
          <h2 class="mt-8 text-3xl font-medium leading-9 text-gray-900 tracking-tight sm:text-4xl sm:truncate">Register</h2>
          <p class="mt-3 leading-6 text-gray-500">
            Already have an account?
            <RouterLink :to="{ name: 'login' }" class="font-medium leading-6 text-violet-500 hover:text-violet-600">Sign in</RouterLink>
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
              <AppInput v-model="inputs.organization_title" label="Organization name" :errors="errorStore.errors.organization_title" required />
              <AppInput v-model="inputs.organization_domain" label="Website domain" placeholder="acmecu.com" :errors="errorStore.errors.organization_domain" required />
              <AppInput v-model="inputs.password" :errors="errorStore.errors.password" type="password" label="Create password" required />
              <AppPasswordChecker v-if="inputs.password" :password="inputs.password"/>
              <div class="flex items-center py-2">
                <input v-model="inputs.accept_terms" required id="agree" name="agree" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-600" />
                <label for="agree" class="ml-2 block text-sm leading-6 text-gray-900">
                  I agree to MetriFi's <a href="https://metrifi.com/legal/terms-of-service/" target="_blank" class="text-violet-500 hover:underline">Terms of Service</a> and <a href="https://metrifi.com/legal/privacy-policy/" target="_blank" class="text-violet-500 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <AppButton :loading="authStore.loading" class="w-full">Register with email</AppButton>
            </div>
            
          </form>
        </div>
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80" alt="" />
    </div>
  </main>
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
  organization_domain: '',
  password: '',
  accept_terms: false
})

function register() {
  const { name, email, organization_title, organization_domain, password, accept_terms } = inputs.value
  authStore.register(name, email, organization_title, organization_domain, password, accept_terms)
}
</script>
