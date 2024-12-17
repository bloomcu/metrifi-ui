import { ref, onMounted, watch, reactive } from 'vue'

export function useInfiniteScroll(apiMethod, options = { rootMargin: '50px' }, baseParams = {}) {
    // Reference to the element that triggers loading more
    const loadMoreElement = ref(null)

    // Data state
    const items = ref([])
    const isLoading = ref(false)
    const pagination = reactive({
        current_page: 1,
        last_page: null, // Will be set after the first API response
    })

    const params = reactive({ ...baseParams }) // Custom parameters for API

    // Observer setup using vanilla JS IntersectionObserver
    onMounted(() => {
        const observer = new IntersectionObserver(handleIntersect, options)

        if (loadMoreElement.value) {
            observer.observe(loadMoreElement.value)
        }

        // Disconnect observer on component unmount
        watch(loadMoreElement, (newValue, oldValue) => {
            if (oldValue) observer.unobserve(oldValue)
            if (newValue) observer.observe(newValue)
        })
    })

    // Handle intersection event to load more items
    const handleIntersect = async (entries) => {
        const entry = entries[0]
        if (
            entry.isIntersecting &&
            !isLoading.value &&
            (pagination.last_page === null || pagination.current_page < pagination.last_page)
        ) {
            await loadMore()
        }
    }

    // Load more items using the provided API method
    const loadMore = async () => {
        isLoading.value = true
        try {
            const apiParams = {
                ...params,
                page: pagination.current_page + 1,
            }

            const response = await apiMethod(apiParams)
            items.value.push(...response.data.data) // Assuming the API returns a `data` array
            pagination.current_page = response.data.meta.current_page
            pagination.last_page = response.data.meta.last_page
        } catch (error) {
            console.error('Failed to load more items:', error)
        } finally {
            isLoading.value = false
        }
    }

    // Function to update params and reset pagination
    const updateParams = (newParams) => {
        Object.assign(params, newParams) // Update params reactively
        items.value = [] // Reset items
        pagination.current_page = 1
        pagination.last_page = null
        loadMore() // Reload with updated params
    }

    return {
        loadMoreElement,
        items,
        isLoading,
        pagination,
        updateParams,
    }
}
