<template>
    <AppDropdown class="w-56">
      <template #title>
        {{ selected ? selected : 'Loading...' }} 
        <ChevronDownIcon class="ml-auto h-4 w-4 text-gray-400"/>
      </template>
      <button 
        v-for="option in options" 
        @click="updateValue(option.value)"
        :class="option.value == modelValue ? 'bg-gray-50 text-indigo-600' : ''" 
        class="w-full text-left rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
      >
        {{ option.label }}
      </button>
    </AppDropdown>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppDropdown from '@/app/components/dropdown/AppDropdown.vue'

const props = defineProps({
    modelValue: { 
        type: String
    },
})

const options = [
  {label: 'Page views', value: 'pageViews'},
  {label: 'Outbound link clicks', value: 'outboundLinkClick'},
  // {label: 'Element clicks', value: 'elementClick'},
  // {label: 'Form submissions', value: 'formSubmission'},
]

const selected = computed(() => {
    return options.find(option => option.value == props.modelValue).label
})

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}
</script>