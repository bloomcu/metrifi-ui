import { ref, onMounted, watch } from 'vue'

export function useInfiniteScroll(apiMethod, options = { rootMargin: '50px' }) {
    // Reference to the element that triggers loading more
    const loadMoreElement = ref(null)

    // Data state
    const items = ref([])
    const isLoading = ref(false)
    const pagination = ref({
        current_page: 1,
        last_page: null, // Will be set after the first API response
    })

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
            (pagination.value.last_page === null || pagination.value.current_page < pagination.value.last_page)
        ) {
            await loadMore()
        }
    }

    // Load more items using the provided API method
    const loadMore = async () => {
        isLoading.value = true
        try {
            const params = { page: pagination.value.current_page + 1 }
            const response = await apiMethod(params)
            items.value.push(...response.data.data) // Assuming the API returns a `data` array
            pagination.value.current_page = response.data.meta.current_page
            pagination.value.last_page = response.data.meta.last_page
        } catch (error) {
            console.error('Failed to load more items:', error)
        } finally {
            isLoading.value = false
        }
    }

    return {
        loadMoreElement,
        items,
        isLoading,
        pagination,
    }
}
