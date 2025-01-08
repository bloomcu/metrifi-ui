<template>
  <main class="flex min-h-screen flex-1">
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-32">
      <div class="mx-auto w-full max-w-lg">
        <div>
          <img width="44" src="/logo-mark.svg" alt="MetriFi" />
          <h2 class="mt-8 text-3xl font-medium leading-9 text-gray-900 tracking-tight sm:text-4xl sm:truncate">Share anonymously</h2>
          <p class="mt-3 text-md leading-6 text-gray-500">Sharing your analytics data anonymously allows you to compare your dashboards with the dashboards of other organizations.</p>
        </div>

        <!-- Switch -->
        <AppCard v-if="organizationStore.organization" class="my-10">
          <div class="mb-6 flex justify-between">
            <div>
              <p class="text-gray-900 font-medium mb-2">Analytics sharing</p>
              <p class="text-sm text-gray-500">Choose how to share your analytics data with others.</p>
            </div>
            <svg v-if="isUpdatingPrivacy" class="inline w-6 h-6 ml-2 text-violet-500 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
          </div>

          <fieldset aria-label="Privacy setting">
            <RadioGroup v-model="organizationStore.organization.is_private" class="-space-y-px rounded-md bg-white">
              <RadioGroupOption as="template" v-for="(setting, settingIdx) in privacySettings" :key="setting.name" :value="setting.value" :aria-label="setting.name" :aria-description="setting.description" v-slot="{ checked, active }">
                <div :class="[settingIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '', settingIdx === privacySettings.length - 1 ? 'rounded-bl-md rounded-br-md' : '', checked ? 'z-10 border-violet-200 bg-violet-50' : 'border-gray-200', 'relative flex cursor-pointer border p-5 focus:outline-none']">
                  <span :class="[checked ? 'border-transparent bg-violet-500' : 'border-gray-300 bg-white', active ? 'ring-2 ring-violet-600 ring-offset-2' : '', 'mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border']" aria-hidden="true">
                    <span class="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  <span class="ml-4 flex flex-col">
                    <component :is="setting.icon" :class="[checked ? 'text-violet-500' : 'text-gray-500']" class="-ml-0.5 mb-2 h-5 w-5" aria-hidden="true" />
                    <span :class="[checked ? 'text-violet-700' : 'text-gray-900']" class="block text-sm font-medium mb-2">{{ setting.name }}</span>
                    <span :class="[checked ? 'text-violet-500' : 'text-gray-500']" class="block text-sm">{{ setting.description }}</span>
                  </span>
                </div>
              </RadioGroupOption>
            </RadioGroup>
          </fieldset>
        </AppCard>

        <AppButton :to="{ name: 'welcome', params: { organization: route.params.organization }}" class="w-full">Continue</AppButton>
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80" alt="" />
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const organizationStore = useOrganizationStore()

const isUpdatingPrivacy = ref(false)
const privacySettings = [
  { 
    name: 'Private (no sharing)', 
    value: 1, 
    description: 'Your analytics data is not shared with anyone outside of your organization. Data from other organizations is not shared with you.',
    icon: EyeSlashIcon,
  },  
  { 
    name: 'Share anonymously', 
    value: 0, 
    description: 'Your analytics data is anonymously shared with people outside of your organization. Anonymous data from other organizations is shared with you.',
    icon: EyeIcon,
  },
]

watch(
  () => organizationStore.organization?.is_private,
  (newValue, oldValue) => {
    // Ensure the watcher doesn't trigger unnecessarily
    if (newValue === undefined) return;
    
    isUpdatingPrivacy.value = true

    organizationStore.update().then(() => {
      console.log('doing the thing...')
      setTimeout(() => isUpdatingPrivacy.value = false, 1000);
    })
  },
  { deep: true, immediate: false } // Prevent the watcher from firing at initialization
)

onMounted(() => {
  organizationStore.show(route.params.organization)
})
</script>
