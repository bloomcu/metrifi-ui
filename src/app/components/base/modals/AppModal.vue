<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="close()">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10">
        <div class="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel :class="`${sizeClasses[size]}`" class="relative overflow-x-hidden top-10 mx-auto rounded-2xl bg-white p-5 text-left shadow-xl transition-all w-full sm:p-6">
              <slot/>
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

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'sm'
  }
})

const isOpen = ref(props.open)

function close() {
  emit('closed')
}

const emit = defineEmits(['closed'])

const sizeClasses = {
  'sm': 'sm:max-w-sm',
  'md': 'sm:max-w-md',
  'lg': 'sm:max-w-lg',
  'xl': 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  '6xl': 'sm:max-w-6xl',
}
</script>