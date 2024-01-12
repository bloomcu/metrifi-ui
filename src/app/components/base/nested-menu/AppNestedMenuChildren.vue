<template>
  <li v-for="option in options" :key="option.slug">
    <!-- Parent -->
    <Disclosure as="div" v-slot="{ open }">
      <DisclosureButton 
        @click.prevent="emitSelected(option.slug)" 
        :class="[
          active === option.slug ? 'bg-gray-50 text-indigo-600' : '', 
          option.children && option.children.length ? 'font-semibold' : ''
        ]"
        class="flex items-center w-full text-left rounded-md mt-1 p-2 gap-x-3 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
      >
        {{ option.title }}
        <ChevronRightIcon 
          v-if="option.children && option.children.length"
          :class="open ? 'rotate-90 text-gray-500' : ''"
          class="ml-auto h-5 w-5 shrink-0 text-gray-400"
          aria-hidden="true" 
        />
      </DisclosureButton>

      <!-- Children -->
      <DisclosurePanel as="ul" class="mt-1 px-2">
          <ul v-if="option.children && option.children.length" role="list" class="-mx-2 space-y-1 pl-2">
            <AppNestedMenuChildren :options="option.children" :active="active" @selected="emitSelected"/>
          </ul>
      </DisclosurePanel>
    </Disclosure>
  </li>
</template>

<script>
export default {
  name: 'AppNestedMenuChildren'
}
</script>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
options: { 
  type: Object,
  required: true
},
active: {
  type: String
}
})

const emit = defineEmits(['selected'])

function emitSelected(value) {
  emit('selected', value)
}
</script>
