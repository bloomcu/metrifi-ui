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
              class="relative overflow-x-hidden bg-white text-left shadow-xl transition-transform w-full overflow-y-auto"
            >
              <!-- Close Button -->
              <button
                type="button"
                @click="close()"
                class="absolute top-6 right-6 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <XMarkIcon class="h-8 w-8 text-gray-600"/>
              </button>

              <slot />
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
  sm: 'sm:max-w-sm mx-auto top-10 rounded-2xl max-h-screen',
  md: 'sm:max-w-md mx-auto top-10 rounded-2xl max-h-screen',
  lg: 'sm:max-w-lg mx-auto top-10 rounded-2xl max-h-screen',
  xl: 'sm:max-w-xl mx-auto top-10 rounded-2xl max-h-screen',
  '2xl': 'sm:max-w-2xl mx-auto top-10 rounded-2xl max-h-screen',
  '3xl': 'sm:max-w-3xl mx-auto top-10 rounded-2xl max-h-screen',
  '4xl': 'sm:max-w-4xl mx-auto top-10 rounded-2xl max-h-screen',
  '5xl': 'sm:max-w-5xl mx-auto top-10 rounded-2xl max-h-screen',
  '6xl': 'sm:max-w-6xl mx-auto top-10 rounded-2xl max-h-screen',
  'full': 'h-screen', // No max-width or centering for full width
}
</script>
