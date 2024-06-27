<template>
  <main class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-20">
    <div v-if="invitationStore.invitation && !invitationStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-24">
        <div>
          <p class="text-lg leading-8 text-gray-500">Invitation</p>

          <h1 class="mt-4 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
            You've been invited to the <span class="text-indigo-600">{{ invitationStore.invitation.organization.title }}</span> team.
          </h1>
          
          <div class="mt-8 flex items-center">
              <Avatar :name="invitationStore.invitation.user.name"/>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 group-hover:text-gray-700">Invited by</p>
                <p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">{{ invitationStore.invitation.user.name }}</p>
              </div>
            </div>
        </div>
        
        <div>
          <form action="#" @submit.prevent="register()">
            <div v-if="errorStore.errors.credentials" class="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-2" role="alert">
              <p>{{ errorStore.errors.credentials[0] }}</p>
            </div>
            
            <div class="flex flex-col gap-3">
              <AppInput v-model="inputs.name" label="Full name" :errors="errorStore.errors.name" required autofocus />
              <AppInput v-model="inputs.email" label="Email" :errors="errorStore.errors.email" disabled />
              <AppInput v-model="inputs.password" :errors="errorStore.errors.password" type="password" label="Password" required />
              <AppInput v-model="inputs.password_confirmation" type="password" label="Confirm password" required />
              <AppPasswordChecker v-if="inputs.password" :password="inputs.password"/>
              <div class="flex items-center py-2">
                <input v-model="inputs.accept_terms" required id="agree" name="agree" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                <label for="agree" class="ml-2 block text-sm leading-6 text-gray-900">
                  I agree to MetriFi's <a href="https://metrifi.com/legal/terms-of-service/" target="_blank" class="text-indigo-600 hover:underline">Terms of Service</a> and <a href="https://metrifi.com/legal/privacy-policy/" target="_blank" class="text-indigo-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
              
              <AppButton :loading="authStore.loading" class="w-full">Join</AppButton>
            </div>
          </form>
        </div>
      </div>
      
      <InvitationSkeletonLoader v-else/>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { useInvitationStore } from '@/domain/base/invitations/store/useInvitationStore'
import AppPasswordChecker from '@/app/components/base/forms/AppPasswordChecker.vue'
import Avatar from '@/app/components/base/avatars/Avatar.vue'
import InvitationSkeletonLoader from '@/views/base/invitations/loaders/InvitationSkeletonLoader.vue'

const route = useRoute()
const errorStore = useErrorStore()
const authStore = useAuthStore()
const invitationStore = useInvitationStore()

const inputs = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  accept_terms: false
})

function register() {
  const { name, email, password, password_confirmation, accept_terms } = inputs.value
  authStore.registerWithInvitation(route.params.invitation, name, email, password, password_confirmation, accept_terms)
}

onMounted(() => {
  invitationStore.show(route.params.invitation)
    .then(() => {
      inputs.value.email = invitationStore.invitation.email
    })
})
</script>
