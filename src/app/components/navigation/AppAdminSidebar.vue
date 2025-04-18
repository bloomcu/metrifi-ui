<template>
  <div>
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
          <ul role="list" class="flex flex-1 flex-col gap-y-3">
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
              <Menu as="div" class="-mx-2 space-y-1">
                <MenuButton class="flex items-center gap-x-4 p-2 w-full text-sm font-medium leading-6 text-gray-900 rounded-md hover:bg-gray-50">
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
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'

import Avatar from '@/app/components/base/avatars/Avatar.vue'

const authStore = useAuthStore()

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
  HomeModernIcon,
  Squares2X2Icon,
  ChartBarIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'All Dashboards', to: { name: 'adminDashboards'}, icon: Squares2X2Icon},
  { name: 'All Funnels', to: { name: 'adminFunnels'}, icon: ChartBarIcon},
  { name: 'Organizations', to: { name: 'adminOrganizations'}, icon: HomeModernIcon},
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