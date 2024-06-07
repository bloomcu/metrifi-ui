import { ref, computed } from 'vue'
import { categoryApi } from '@/domain/base/categories/api/categoryApi.js'

let categories = ref()
let category = ref()
let isUpdateCategoryModalOpen = ref(false)

export default function useCategories() {
  async function indexCategories(params) {
    await categoryApi.index(params).then(response => {
      categories.value = response.data.data
    })
  }

  async function storeCategory(category) {
    await categoryApi.store(category).then(response => {
      categories.value.push(response.data.data)
      return response.data.data
    })
  }

  async function showCategory(id) {
    await categoryApi.show(id).then(response => {
      category.value = response.data.data
    })
  }

  async function updateCategory(id, category) {
    return await categoryApi.update(id, category).then(response => {
      // update category
      location.value = response.data.data
      
      // update category in the category list
      const index = categories.value.findIndex((category) => category.id === id)
      categories.value[index] = response.data.data
      return response.data.data
    })
  }

  async function destroyCategory(id) {
    await categoryApi.destroy(id).then(response => {
      category.value = null
      categories.value = categories.value.filter((category) => category.id !== id)
    })
  }

  return {
    categories: computed(() => categories.value),
    category: computed(() => category.value),
    isUpdateCategoryModalOpen,
    indexCategories,
    storeCategory,
    showCategory,
    updateCategory,
    destroyCategory,
  }
}