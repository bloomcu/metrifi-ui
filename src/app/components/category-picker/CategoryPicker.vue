<template>
    <AppDropdown class="w-3/12">
      <template #title>
        <span v-if="modelValue">{{ modelValue.title }}</span>
        <span v-else class="text-gray-400">Select category</span>
        <ChevronDownIcon class="ml-auto h-4 w-4 text-gray-400"/>
      </template>
      <button @click="updateValue(null)" class="w-full text-left rounded-md p-2 leading-6 text-gray-400 hover:bg-gray-50 hover:text-indigo-600">
        Select category...
      </button>
      <button 
        v-for="category in categories" 
        @click="updateValue(category)"
        :class="modelValue && category.id == modelValue.id ? 'bg-gray-50 text-indigo-600' : ''" 
        class="w-full text-left rounded-md p-2 leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
      >
        {{ category.title }}
      </button>
    </AppDropdown>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import useCategories from '@/domain/base/categories/composables/useCategories'
import AppDropdown from '@/app/components/dropdown/AppDropdown.vue'

const props = defineProps({
    modelValue: null,
})

const { categories, indexCategories } = useCategories()

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}

onMounted(() => {
  if (!categories.length) {
    indexCategories()
  }
})
</script>