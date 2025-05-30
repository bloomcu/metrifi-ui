<template>
  <main class="py-10 mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
    <!-- Success message -->
    <div v-if="authStore.passwordResetEmailSent" class="rounded-md bg-emerald-50 p-6">
      <div class="flex">
        <div class="flex items-center">
          <CheckCircleIcon class="h-10 w-10 text-emerald-400" aria-hidden="true" />
          <p class="ml-3 sm:text-2xl text-xl font-medium leading-7 text-gray-900 tracking-tight">Check you inbox</p>
        </div>
      </div>
      <p class="mt-3 text-lg leading-8 text-gray-900">If an account with that email exists, a password reset email has been sent.</p>
    </div>

    <!-- Form -->
    <form v-else action="#" @submit.prevent="submit()">
      <div class="text-center mb-4">
        <h1 class="text-3xl font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-4xl">Forgot password</h1>
        <p class="mt-4 text-lg leading-8 text-gray-500">Enter your email and we’ll send a reset link.</p>
      </div>
      
      <div v-if="errorStore.errors.credentials" class="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-2" role="alert">
        <p>{{ errorStore.errors.credentials[0] }}</p>
      </div>
      
      <div class="flex flex-col gap-4">
        <AppInput v-model="inputs.email" label="Email" required autofocus :errors="errorStore.errors.email" />
        <AppButton :loading="authStore.passwordResetEmailSending" class="w-full">Send reset link</AppButton>
      </div>
    </form>

    <div class="text-center mt-4">
      <p class="text-sm text-gray-500">
        <RouterLink :to="{ name: 'login' }" class="font-medium leading-6 text-violet-500 hover:text-violet-600">Return to sign in</RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { CheckCircleIcon } from '@heroicons/vue/20/solid'

const errorStore = useErrorStore()
const authStore = useAuthStore()

const inputs = ref({
  email: ''
})

function submit() {
  const { email } = inputs.value
  authStore.requestPasswordReset(email)
}

onMounted(() => {
  authStore.passwordResetEmailSent = false
  authStore.passwordResetEmailSending = false
})
</script>
