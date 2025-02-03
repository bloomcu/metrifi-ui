<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="block font-medium text-gray-900" :for="label">{{ label }}</label>
    <div class="relative flex items-center">
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
        :maxlength="maxlength"
        :class="[
          errors ? 'ring-red-300 placeholder:text-red-300 hover:ring-red-600 focus:ring-red-500' : 'ring-gray-300 placeholder:text-gray-400',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:ring-violet-600 focus:ring-violet-600 hover:ring-2 focus:ring-2'
        ]"
        ref="inputRef"
        class="block w-full rounded-md border-0 px-2 py-2 pr-8 text-gray-900 shadow-sm ring-1 sm:leading-6"
      >
      <span v-if="append" class="absolute right-2 text-gray-500 pointer-events-none">{{ append }}</span>
    </div>
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
    type: [String, Number]
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
  },
  maxlength: {
    type: Number,
  },
  append: {
    type: String,
    default: ''
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