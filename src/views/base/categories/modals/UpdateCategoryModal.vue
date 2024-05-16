<template>
  <AppModal 
    size="md"
    @closed="isUpdateCategoryModalOpen = false" 
    :open="isUpdateCategoryModalOpen"
  >
    <form v-if="category" action="#" @submit.prevent="update(category.id, category)" class="flex flex-col gap-3">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Update category</h3>
      <AppInput v-model="category.title" label="Title" placeholder="Acme Credit Union" required />
      <AppButton class="w-full">Update</AppButton>
    </form>
  </AppModal>
</template>

<script setup>
import useCategories from '@/domain/base/categories/composables/useCategories'
const { category, updateCategory, isUpdateCategoryModalOpen } = useCategories()

function update(id, category) {
  updateCategory(id, category)
  isUpdateCategoryModalOpen.value = false
}
</script>
