<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Dashboard</h1>
    </template>

    <div class="max-w-2xl">
      <ol role="list" class="overflow-hidden">
        <li v-for="(step, stepIdx) in steps" :key="step.name" class="pb-4 relative">
            <div 
              v-if="stepIdx !== steps.length - 1" 
              :class="step.status === 'complete' ? 'bg-indigo-600' : 'bg-gray-300'"
              class="absolute left-4 top-4 -ml-px mt-3 h-full w-0.5"
            />
            
            <div class="group relative flex items-center">
              <span class="flex h-9 items-center">
                <span v-if="step.status === 'complete'" class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                  <CheckIcon class="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <span v-else-if="step.status === 'current'" class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                  <span class="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                </span>
                <span v-else class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                  <span class="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                </span>
              </span>

              <div 
                :class="step.status === 'complete' ? 'bg-gray-50' : 'border'"
                class="flex justify-between items-center w-full px-5 py-6 rounded-xl ml-4"
              >
                <div class="flex flex-col min-w-0">
                  <span :class="step.status === 'current' ? 'text-indigo-600' : 'text-gray-500'" class="text-sm font-medium">
                    {{ step.name }}
                  </span>
                  <span class="text-sm text-gray-500">{{ step.description }}</span>
                </div>
                <AppButton v-if="step.status !== 'complete'" :variant="step.status === 'current' ? 'primary' : 'secondary'" :disabled="step.status !== 'current'">Action</AppButton>
              </div>
            </div>
        </li>
      </ol>
    </div>
    
  </LayoutWithSidebar>
</template>

<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

const steps = [
  { 
    name: 'Create account', 
    description: 'Vitae sed mi luctus laoreet.', 
    href: '#', 
    status: 'complete' 
  },
  {
    name: 'Profile information',
    description: 'Cursus semper viverra facilisis et et some more.',
    href: '#',
    status: 'current',
  },
  { 
    name: 'Business information', 
    description: 'Penatibus eu quis ante.', 
    href: '#', 
    status: 'upcoming' 
  },
  { 
    name: 'Theme', 
    description: 'Faucibus nec enim leo et.', 
    href: '#', 
    status: 'upcoming' 
  },
  { 
    name: 'Preview', 
    description: 'Iusto et officia maiores porro ad non quas.', 
    href: '#', 
    status: 'upcoming' 
  },
]
</script>
