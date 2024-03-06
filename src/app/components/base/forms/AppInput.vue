<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="block text-sm font-medium text-gray-900" :for="label">{{ label }}</label>
    <input 
      @input="updateValue($event.target.value)"
      @focus="emit('focus')"
      @blur="emit('blur')"
      :value="modelValue"
      :type="type"
      :name="label"
      :placeholder="placeholder"
      :required="required"
      :autofocus="autofocus"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :class="errors ? 'ring-red-300 placeholder:text-red-300 hover:ring-red-600 focus:ring-red-500' : 'ring-gray-300 placeholder:text-gray-400 hover:ring-indigo-600 focus:ring-indigo-600'"
      ref="inputRef"
      class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 hover:ring-2 focus:ring-2 sm:text-sm sm:leading-6"
    >
    <span v-if="hint" class="text-sm text-gray-400">{{ hint }}</span>
    <div v-if="errors" class="mt-2 text-sm text-red-600" role="alert">
      <ul v-if="errors.length > 1">
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
      <p v-else>{{ errors[0] }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { 
    type: String
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String
  },
  hint: {
    type: String
  },
  placeholder: {
    type: String
  },
  errors: {
    type: Array
  },
  required: {
    type: Boolean,
    default: false
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const inputRef = ref()
const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

function updateValue(value) {
  emit('update:modelValue', value)
}

defineExpose({
  inputRef
})
</script>
