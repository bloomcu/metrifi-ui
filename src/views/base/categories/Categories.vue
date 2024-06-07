<template>
  <LayoutDefault>
    <!-- Header -->
    <AppHeader class="pt-6">
      <h1 class="text-3xl font-medium leading-6 text-gray-900">Categories</h1>
      <AppButton @click="storeCategory({title: 'New category'})">New category</AppButton>
    </AppHeader>

    <!-- Organizations -->
    <AppCard padding="none">
      <ul role="list" class="divide-y divide-gray-100">
        <li v-for="category in categories" :key="category.slug" @click="show(category.id)" class="relative flex justify-between gap-x-6 px-4 py-5 cursor-pointer hover:bg-gray-50 sm:px-6">
          <div class="flex gap-x-4">
            <div class="min-w-0 flex-auto">
              <p class="text-base font-medium leading-6 text-gray-900">
                <span class="absolute inset-x-0 -top-px bottom-0" />
                  {{ category.title }}
              </p>

              <p v-if="category.children" class="mt-1 text-sm leading-5 text-gray-500">{{ category.children.length }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-x-4">
            <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </div>
        </li>
      </ul>
    </AppCard>

    <UpdateCategoryModal/>
  </LayoutDefault>
</template>

<script setup>
import { onMounted } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import useCategories from '@/domain/base/categories/composables/useCategories'
import UpdateCategoryModal from './modals/UpdateCategoryModal.vue'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'

const { categories, indexCategories, storeCategory, showCategory, isUpdateCategoryModalOpen } = useCategories()

function show(id) {
  showCategory(id)
  isUpdateCategoryModalOpen.value = true
}

// const newCategory = ref(null)

// function startNewContact() {
//   newCategory.value = {
//     name: '',
//     title: '',
//     phone: '',
//     email: '',
//     linkedin_url: '',
//   }
// }

onMounted(() => {
    indexCategories()
})
</script>
