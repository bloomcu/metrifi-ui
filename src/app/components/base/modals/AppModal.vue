<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="close()">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10">
        <div
          :class="[
            'flex min-h-full items-start',
            size === 'full' ? '' : 'justify-center',
            size === 'full' ? 'text-left' : 'text-center'
          ]"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              :class="sizeClasses[size]"
              class="
                relative 
                mx-auto 
                text-left 
                transition-transform 
                w-full 
                overflow-hidden 
                bg-white 
                shadow-lg 
                rounded-lg
              "
            >
              <!-- Close Button -->
              <button
                type="button"
                @click="close()"
                class="absolute top-4 right-6 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <XMarkIcon class="h-7 w-7 text-gray-600"/>
              </button>

              <!-- Scrollable Content Wrapper -->
              <div class="max-h-[100vh] overflow-y-auto p-4">
                <slot />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'sm',
  },
})

const emit = defineEmits(['closed'])

function close() {
  emit('closed')
}

const sizeClasses = {
  sm: 'sm:max-w-sm top-10 max-h-screen',
  md: 'sm:max-w-md top-10 max-h-screen',
  lg: 'sm:max-w-lg top-10 max-h-screen',
  xl: 'sm:max-w-xl top-10 max-h-screen',
  '2xl': 'sm:max-w-2xl top-10max-h-screen',
  '3xl': 'sm:max-w-3xl top-10 max-h-screen',
  '4xl': 'sm:max-w-4xl top-10 max-h-screen',
  '5xl': 'sm:max-w-5xl top-10 max-h-screen',
  '6xl': 'sm:max-w-6xl top-10 max-h-screen',
  '7xl': 'sm:max-w-7xl top-10 max-h-screen',
  'super': 'sm:max-w-[1800px] top-[3vh] max-h-[93vh] mx-10 pb-10',
  'full': 'h-screen', // No max-width or centering for full width
}
</script>
