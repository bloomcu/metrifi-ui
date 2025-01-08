<template>
  <main class="py-10 mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
    <!-- Success message -->
    <div v-if="authStore.passwordReset" class="rounded-md bg-green-50 p-6">
      <div class="flex">
        <div class="flex items-center">
          <CheckCircleIcon class="h-10 w-10 text-green-400" aria-hidden="true" />
          <p class="ml-3 sm:text-2xl text-xl font-medium leading-7 text-gray-900 tracking-tight">Success!</p>
        </div>
      </div>
      <p class="mt-3 text-lg leading-8 text-gray-900">Your password has been reset.</p>
      <RouterLink :to="{ name: 'login' }" class="font-medium leading-6 text-violet-500 hover:text-violet-600">Return to sign in</RouterLink>
    </div>

    <!-- Form -->
    <form v-else action="#" @submit.prevent="submit()">
      <div class="text-center mb-4">
        <h1 class="text-3xl font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-4xl">New password</h1>
        <p class="mt-4 text-lg leading-8 text-gray-500">Enter your new password</p>
      </div>

      <div v-if="errorStore.errors.password" class="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-2" role="alert">
        <p>{{ errorStore.errors.password[0] }}</p>
      </div>
        
      <div class="flex flex-col gap-3">
        <AppInput v-model="inputs.password" type="password" label="Password" required />
        <AppPasswordChecker v-if="inputs.password" :password="inputs.password"/>
        <AppButton :loading="authStore.passwordResetting" class="w-full">Reset password</AppButton>
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
import { useRoute } from 'vue-router'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import AppPasswordChecker from '@/app/components/base/forms/AppPasswordChecker.vue'

const route = useRoute()
const errorStore = useErrorStore()
const authStore = useAuthStore()

const inputs = ref({
  password: '',
})

function submit() {
  const { password } = inputs.value
  authStore.resetPassword(route.query.token, route.query.email, password)
}

onMounted(() => {
  authStore.passwordResetting = false
  authStore.passwordReset = false
})
</script>
