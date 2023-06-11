<template>
  <main class="py-10">
      <div class="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <form action="#" @submit.prevent="login()">
          <div class="text-center mb-4">
            <h1 class="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Log in</h1>
          </div>
          
          <div v-if="errorStore.errors.credentials" class="bg-error bg-opacity-20% padding-xs radius-md text-sm color-contrast-higher margin-bottom-xs" role="alert">
            <p>{{ errorStore.errors.credentials[0] }}</p>
          </div>
          
          <AppInput v-model="inputs.email" label="Email" required autofocus :errors="errorStore.errors.email" />
          <AppInput v-model="inputs.password" label="Password" type="password" :errors="errorStore.errors.password" required />
          <AppSubmit :loading="authStore.loading" class="w-full">Login with email</AppSubmit>
          
          <!-- <p class="text-center margin-y-sm">or</p>

          <div class="grid gap-xs margin-bottom-md">
            <div class="col-6@xs">
              <a class="btn btn--subtle width-100%">
                <svg class="icon margin-right-xxxs" viewBox="0 0 48 48"><g class="nc-icon-wrapper"><path d="M24,11a12.932,12.932,0,0,1,8.346,3.047l6.54-6.228A21.973,21.973,0,0,0,4.293,14.236l7.373,5.683A13.016,13.016,0,0,1,24,11Z" fill="#d94f3d"></path> <path d="M11,24a12.942,12.942,0,0,1,.666-4.081L4.293,14.236a21.935,21.935,0,0,0,0,19.528l7.373-5.683A12.942,12.942,0,0,1,11,24Z" fill="#f2c042"></path> <path d="M45.1,20h-21v9H36a10.727,10.727,0,0,1-4.555,6.162l7.316,5.64C43.436,36.606,46.183,29.783,45.1,20Z" fill="#5085ed"></path> <path d="M31.442,35.162A13.98,13.98,0,0,1,24,37a13.016,13.016,0,0,1-12.334-8.919L4.293,33.764A22.023,22.023,0,0,0,24,46a21.865,21.865,0,0,0,14.758-5.2Z" fill="#57a75c"></path></g></svg>
                <span>Log in with Google</span>
              </a>
            </div>
            
            <div class="col-6@xs">
              <a class="btn btn--subtle width-100%">
                <svg class="icon margin-right-xxxs" viewBox="0 0 48 48"><g class="nc-icon-wrapper"><rect x="3" y="3" fill="#E86C60" width="20" height="20"></rect> <rect x="25" y="3" fill="#72C472" width="20" height="20"></rect> <rect x="3" y="25" fill="#43A6DD" width="20" height="20"></rect> <rect x="25" y="25" fill="#EFD358" width="20" height="20"></rect></g></svg>
                <span>Log in with Microsoft</span>
              </a>
            </div>
          </div> -->
          
          <div class="text-center mt-4">
            <p class="text-sm text-gray-500">
              Forgot password?
              <RouterLink :to="{ name: 'forgotPassword' }" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Reset password</RouterLink>
            </p>
            <p class="text-sm text-gray-500">
              Don't have an account? 
              <RouterLink :to="{ name: 'register' }" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Get started</RouterLink>
            </p>
          </div>
          
        </form>
      </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import AppInput from '@/app/components/base/forms/AppInput.vue'
import AppSubmit from '@/app/components/base/forms/AppSubmit.vue'

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
