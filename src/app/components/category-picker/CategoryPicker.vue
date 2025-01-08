<template>
    <AppDropdown>
      <template #title>
        <div v-if="modelValue">
          <span class="font-medium text-left">Category: </span>
          <span class="text-gray-500 text-left">{{ modelValue.title }}</span>
          <button @click.stop="updateValue(null)" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <span v-else class="text-gray-500 text-left">Category</span>
        <!-- <ChevronDownIcon class="ml-2 h-4 w-4 text-gray-400" /> -->
      </template>

      <button @click="updateValue(null)" class="w-full text-left rounded-md p-2 leading-6 text-gray-400 hover:bg-gray-50 hover:text-violet-600">
        Unselect
      </button>

      <button
        @click="updateValue({ id: 1, title: 'Uncategorized', slug: 'uncategorized', children: [] })"
        :class="modelValue && modelValue.id == 1 ? 'bg-gray-50 text-violet-600' : ''"
        class="w-full text-left rounded-md p-2 leading-6 text-gray-500 hover:bg-gray-50 hover:text-violet-600"
      >
        Uncategorized
      </button>

      <div v-if="category" v-for="parent in category.children" class="flex flex-col p-2">
        <div class="mb-2 text-left">{{ parent.title }}</div>

        <button
          v-if="parent.children"
          v-for="child in parent.children"
          @click="updateValue(child)"
          :class="modelValue && child.id == modelValue.id ? 'bg-gray-50 text-violet-600' : ''"
          class="rounded-md p-2 leading-6 text-gray-500 hover:bg-gray-50 hover:text-violet-600 text-left"
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
  showCategory(2)
})
</script>