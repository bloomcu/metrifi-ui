import { defineStore, acceptHMRUpdate } from 'pinia'

export const useErrorStore = defineStore('errorStore', {
  state: () => ({
      errors: [],
      serverError: null
  }),

  actions: {
    setErrors(errors) {
      this.errors = errors
    },

    setServerError(error) {
      this.serverError = error
    },
    
    emptyErrors() {
      this.errors = []
    }
  }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
