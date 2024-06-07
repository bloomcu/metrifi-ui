<template>
  <!-- Invite -->
  <div class="mb-12">
    <h2 class="text-base font-medium leading-6 text-gray-900">Invite user</h2>
    <p class="mt-2 text-sm text-gray-500">Provide the email address of a teammate, and an invitation will be sent to them.</p>

    <form @submit.prevent="submit()" class="mt-4 sm:flex sm:items-center">
      <div class="w-full sm:max-w-xs">
        <AppInput v-model="email" placeholder="email@example.com" required :errors="errorStore.errors.email" />
      </div>
      <AppButton :loading="sendingInvite" class="self-start sm:w-auto sm:mt-0 sm:ml-3 mt-3 w-full">Send invite</AppButton>
    </form>
  </div>

  <!-- Invitations -->
  <AppCard v-if="inviteStore.invitations && inviteStore.invitations.length" class="mb-12">
    <h2 class="text-base font-medium leading-6 text-gray-900">Invitations</h2>
    <p class="mt-2 text-sm text-gray-500">A list of invitations not yet accepted.</p>

    <div class="mt-4 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-0">Email</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Invited</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="invite in inviteStore.invitations" :key="invite.uuid">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{ invite.email }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ moment(invite.created_at).fromNow() }}</td>
                <td class="relative space-x-4 whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-0">
                  <AppButtonCopyText :value="invite.url">Copy invite URL</AppButtonCopyText>
                  <AppButton variant="link" @click="inviteStore.destroy(invite.uuid)">Delete</AppButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppCard> <!-- end invitations table -->

  <!-- Users -->
  <AppCard class="mb-12">
    <h2 class="text-base font-medium leading-6 text-gray-900">Users</h2>
    <p class="mt-2 text-sm text-gray-500">A list of all the users in your organization.</p>

    <div class="mt-4 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-0">Name</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Email</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Role</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Joined</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Accepted terms</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Remove user</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in userStore.users" :key="user.id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{ user.name }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.email }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.role }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ moment(user.created_at).fromNow() }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ moment(user.accepted_terms_at).fromNow() }}</td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <AppButton v-if="authStore.user.id !== user.id" @click="userStore.destroy(user.id)" variant="link">Remove user</AppButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppCard> <!-- end users table -->
</template>

<script setup>
import moment from "moment"
import { ref, onMounted } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useInvitationStore } from '@/domain/base/invitations/store/useInvitationStore'
import { useUserStore } from '@/domain/base/users/store/useUserStore'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import AppButtonCopyText from '@/app/components/base/buttons/AppButtonCopyText.vue'

const errorStore = useErrorStore()
const inviteStore = useInvitationStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const email = ref('')
const sendingInvite = ref(false)

function submit() {
  sendingInvite.value = true
  
  inviteStore.store(email).then(() => {
    email.value = ''
    sendingInvite.value = false
  }).catch((error) => {
    sendingInvite.value = false
  })
}

onMounted(() => {
  inviteStore.index()
  userStore.index()
})
</script>
