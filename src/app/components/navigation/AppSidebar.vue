<template>
  <div v-if="organizationStore.organization">
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10 lg:hidden" @close="close()">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="close()">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div class="flex h-16 shrink-0 items-center">
                  <img width="100" src="/logo.svg" alt="MetriFi" />
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <RouterLink :to="item.to" :class="[item.current ? 'bg-gray-50 text-violet-500' : 'text-gray-700 hover:text-violet-600 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium']">
                            <component :is="item.icon" :class="[item.current ? 'text-violet-500' : 'text-gray-400 group-hover:text-violet-600', 'h-6 w-6 shrink-0']" aria-hidden="true" />
                            {{ item.name }}
                          </RouterLink>
                        </li>
                      </ul>
                    </li>
                    <!-- <li>
                      <div class="text-xs font-medium leading-6 text-gray-400">Your teams</div>
                      <ul role="list" class="-mx-2 mt-2 space-y-1">
                        <li v-for="team in teams" :key="team.name">
                          <a :href="team.href" :class="[team.current ? 'bg-gray-50 text-violet-500' : 'text-gray-700 hover:text-violet-600 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium']">
                            <span :class="[team.current ? 'text-violet-500 border-violet-600' : 'text-gray-400 border-gray-200 group-hover:border-violet-600 group-hover:text-violet-600', 'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white']">{{ team.initial }}</span>
                            <span class="truncate">{{ team.name }}</span>
                          </a>
                        </li>
                      </ul>
                    </li> -->
                    <!-- <li class="mt-auto">
                      <a href="#" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-gray-700 hover:bg-gray-50 hover:text-violet-600">
                        <Cog6ToothIcon class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-violet-600" aria-hidden="true" />
                        Settings
                      </a>
                    </li> -->
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
      <!-- Sidebar -->
      <div class="flex grow flex-col gap-y-3 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center">
          <img width="120" src="/logo.svg" alt="MetriFi" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col">
            <!-- User / organization -->
            <!-- <li>
              <Menu as="div" class="-mx-2">
                <MenuButton class="flex items-center gap-x-4 p-2 w-full rounded-md hover:bg-gray-50">
                  <img class="h-9 w-9 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <div class="flex flex-col items-start">
                    <span class="text-sm font-medium text-gray-900">{{ authStore.user.name }}</span>
                    <span class="text-xs text-gray-400">{{ authStore.user.organization.title }}</span>
                  </div>
                </MenuButton>
                <transition enter-active-class="transition ease-out duration-200" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="absolute left-4 z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white pt-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="px-1 py-1">
                      <div class="px-4 text-xs leading-6 text-gray-400">Organizations</div>
                      <MenuItem v-slot="{ active }" v-for="team in teams" :key="team.name">
                        <a :href="team.href" class="flex gap-x-3 px-4 py-2 rounded-md text-sm leading-6 font-medium text-gray-700 hover:text-violet-600 hover:bg-gray-50">
                          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-violet-600 group-hover:text-violet-600">{{ team.initial }}</span>
                          <span class="truncate">{{ team.name }}</span>
                        </a>
                      </MenuItem>
                    </div>

                    <div class="px-1 py-1">
                      <MenuItem v-slot="{ active }">
                        <RouterLink :to="{ name: 'logout' }" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 rounded-md text-sm text-gray-700']">
                          Log out
                        </RouterLink>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </li> -->

            <!-- Organization -->
            <li v-if="organizationStore.organization && authStore.isAdmin" class="pb-3">
              <ul role="list" class="-mx-2 space-y-1 mb-2">
                <li @click="router.push({ name: 'adminOrganizations'})" class="rounded-md border px-2 py-1 text-sm font-medium leading-6 text-gray-700 truncate cursor-pointer hover:bg-gray-100">
                  {{ organizationStore.organization.title }}
                </li>
              </ul>
            </li>

            <!-- Onboarding -->
            <li v-if="!organizationStore.organization.onboarding.hideOnboarding" class="border-b pb-3 mb-3">
              <ul role="list" class="-mx-2 space-y-1">
                <li>
                  <RouterLink :to="{name: 'welcome'}" class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-gray-700 hover:text-violet-600 hover:bg-gray-50">
                    <HomeIcon class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-violet-600" aria-hidden="true" />
                    Welcome
                  </RouterLink>
                </li>
              </ul>
            </li>
            
            <!-- Main menu -->
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <RouterLink :to="item.to" class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-gray-700 hover:text-violet-600 hover:bg-gray-50">
                    <component :is="item.icon" class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-violet-600" aria-hidden="true" />
                    {{ item.name }}
                  </RouterLink>
                </li>
              </ul>
            </li>
            
            <!-- Bottom / user -->
            <li class="mt-auto">
              <!-- Subscription -->
              <RouterLink v-if="organizationSubscriptionStore.subscription" :to="{name: 'settingsBilling', params: { organization: organizationStore.organization.slug}}">
                <div class="rounded-md cursor-pointer p-3 mb-3 -mx-3 border hover:bg-gray-100">
                  <div class="flex justify-between items-end mb-3">
                    <h2 class="text-sm text-gray-900 leading-tight">Remaining recommendations</h2>
                    <p class="text-sm text-gray-500 whitespace-nowrap">
                      {{ organizationSubscriptionStore.recommendationsRemaining }} of {{ organizationSubscriptionStore.subscription.plan.limits.recommendations }}
                    </p>
                  </div>
                  <div class="w-full h-1 bg-gray-200 rounded-full mb-3">
                    <div 
                      class="h-full bg-violet-500 rounded-full" 
                      :style="{ width: organizationSubscriptionStore.percentageOfUsageRemaining + '%' }">
                    </div>
                  </div>
                  <!-- Plan will cancel -->
                  <p v-if="organizationSubscriptionStore.subscription.ends_at" class="text-xs text-gray-500">
                    <span class="font-semibold text-violet-500">{{ organizationSubscriptionStore.subscription.plan.title }}</span><br>
                    Ends on {{ moment(organizationSubscriptionStore.subscription.ends_at).format('MMM DD, YYYY') }}
                  </p>

                  <!-- Plan will renew -->
                  <p v-else class="text-xs text-gray-500">
                    <span class="font-semibold text-violet-500">{{ organizationSubscriptionStore.subscription.plan.title }}</span><br>
                    Renews on {{ moment(organizationSubscriptionStore.subscription.renews_at).format('MMM DD, YYYY') }}
                  </p>
                </div>
              </RouterLink>

              <!-- User -->
              <Menu as="div" class="-mx-2 space-y-1">
                <MenuButton class="flex items-center gap-x-4 p-2 w-full text-sm font-medium leading-6 text-gray-900 rounded-md hover:bg-gray-100">
                  <Avatar :name="authStore.user.name" size="sm"/>
                  <span>{{ authStore.user.name }}</span>
                </MenuButton>
                <transition enter-active-class="transition ease-out duration-200" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="absolute bottom-16 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                      <RouterLink :to="{ name: 'adminDashboards' }" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Super Dashboard
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                      <RouterLink :to="{ name: 'adminOrganizations' }" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Organizations
                      </RouterLink>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <RouterLink :to="{ name: 'logout' }" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Log out
                      </RouterLink>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment"
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { useOrganizationSubscriptionStore } from '@/domain/organizations/store/useOrganizationSubscriptionStore'

import Avatar from '@/app/components/base/avatars/Avatar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const organizationStore = useOrganizationStore()
const organizationSubscriptionStore = useOrganizationSubscriptionStore()

const emit = defineEmits(['close'])

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
})

function close() {
  emit('close')
}

onMounted(() => {
  organizationSubscriptionStore.show(route.params.organization)
})

import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

import {
  HomeIcon,
  BoltIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Dashboards', to: { name: 'dashboards'}, icon: Squares2X2Icon},
  { name: 'Recommendations', to: { name: 'recommendations'}, icon: BoltIcon},
  { name: 'Funnels', to: { name: 'funnels'}, icon: ChartBarIcon},
  { name: 'Reports', to: { name: 'explore' }, icon: MagnifyingGlassIcon},
  { name: 'Settings', to: { name: 'settings'}, icon: Cog6ToothIcon},
]

const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]
</script>

<style lang="scss" scoped>
.router-link-active {
  @apply bg-gray-50 text-violet-500
}

.router-link-active svg {
  @apply text-violet-500
}
</style>