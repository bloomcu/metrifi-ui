<template>
    <AppDropdown class="w-32">
      <template #title>
        {{ selected ? selected : 'Loading...' }} 
        <ChevronDownIcon class="ml-auto h-4 w-4 text-gray-400"/>
      </template>
      <button 
        v-for="option in zoomOptions" 
        @click="updateValue(option.value)"
        @mouseover="updateValue(option.value)"
        :class="option.value == modelValue ? 'bg-gray-50 text-violet-500' : ''" 
        class="w-full text-left rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-violet-600"
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
        type: Number
    },
})

const zoomOptions = [
    {label: 'No zoom', value: 0},
    {label: 'Zoom: 5', value: 5},
    {label: 'Zoom: 10', value: 10},
    {label: 'Zoom: 15', value: 15},
    {label: 'Zoom: 20', value: 20},
    {label: 'Zoom: 25', value: 25},
    {label: 'Zoom: 50', value: 50},
    {label: 'Zoom: 75', value: 75},
    {label: 'Zoom: 100', value: 100},
    {label: 'Zoom: 150', value: 150},
    {label: 'Zoom: 200', value: 200},
    {label: 'Zoom: 300', value: 300},
    {label: 'Zoom: 400', value: 400},
    {label: 'Zoom: 800', value: 800},
    {label: 'Zoom: 1200', value: 1200},
    {label: 'Zoom: 1600', value: 1600},
]

const selected = computed(() => {
    return zoomOptions.find(option => option.value == props.modelValue).label
})

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}
</script>