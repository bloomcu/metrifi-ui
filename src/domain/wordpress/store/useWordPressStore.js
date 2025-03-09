import { defineStore, acceptHMRUpdate } from 'pinia'

export const useWordPressStore = defineStore('recommendationStore', {
    state: () => ({
        blocks: [
          {
            acf_fc_layout: 'hero',
            layout: 'default',
          }
        ],
    }),
    
    actions: {}
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWordPressStore, import.meta.hot))
}
