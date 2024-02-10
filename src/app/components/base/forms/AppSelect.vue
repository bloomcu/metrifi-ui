<template>
    <div class="flex flex-col gap-1">
      <label v-if="label" class="block text-sm font-medium text-gray-900" :for="label">{{ label }}</label>
      <span v-if="hint" class="text-sm text-gray-400">{{ hint }}</span>
      <select 
        @input="updateValue($event.target.value)" 
        :value="modelValue" 
        :class="errors ? 'ring-red-300 placeholder:text-red-300 hover:ring-red-600 focus:ring-red-500' : 'ring-gray-300 placeholder:text-gray-400 hover:ring-indigo-600 focus:ring-indigo-600'"
        class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 hover:ring-2 focus:ring-2 sm:text-sm sm:leading-6"
      >
        <option disabled value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
  
      <div v-if="errors" class="text-sm text-red-600" role="alert">
        <ul v-if="errors.length > 1">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
        <p v-else>{{ errors[0] }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    modelValue: '',
    label: {
      type: String
    },
    hint: {
      type: String
    },
    placeholder: {
      type: String,
      default: 'Select...'
    },
    options: {
      type: Array
    },
    errors: {
      type: Array
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  function updateValue(value) {
    emit('update:modelValue', value)
  }
  </script>
  