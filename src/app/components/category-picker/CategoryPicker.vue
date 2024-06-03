<template>
    <AppDropdown class="w-[330px]">
      <template #title>
        <span v-if="modelValue">{{ modelValue.title }}</span>
        <span v-else class="text-gray-400">Select category</span>
        <ChevronDownIcon class="ml-auto h-4 w-4 text-gray-400"/>
      </template>
      <button @click="updateValue(null)" class="w-full text-left rounded-md p-2 leading-6 text-gray-500 hover:bg-gray-50 hover:text-indigo-600">
        Select category...
      </button>
      
      <div v-if="category" v-for="parent in category.children" class="p-2">
        <div class="mb-2">{{ parent.title }}</div>

        <button 
          v-if="parent.children"
          v-for="child in parent.children" 
          @click="updateValue(child)"
          :class="modelValue && child.id == modelValue.id ? 'bg-gray-50 text-indigo-600' : ''" 
          class="w-full text-left rounded-md p-2 leading-6 text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
        >
          {{ child.title }}
        </button>
      </div>
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

const { category, showCategory } = useCategories()

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}

onMounted(() => {
  // if (!category) {
    // indexCategories()
    showCategory(1)
  // }
})
</script>