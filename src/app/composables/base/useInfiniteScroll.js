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

    const meta = reactive({
        total: 0,
    })

    const params = reactive({ ...baseParams }) // Custom parameters for API

    let observer; // Store the observer instance for cleanup

    // Observer setup using vanilla JS IntersectionObserver
    onMounted(() => {
        observer = new IntersectionObserver(handleIntersect, options)

        if (loadMoreElement.value) {
            observer.observe(loadMoreElement.value)
        }

        // Disconnect observer on component unmount or when element changes
        watch(loadMoreElement, (newValue, oldValue) => {
            if (oldValue) observer.unobserve(oldValue)
            if (newValue) observer.observe(newValue)
        })
    })

    // Handle intersection event to load more items
    const handleIntersect = async (entries) => {
        const entry = entries[0];
        if (
            entry.isIntersecting &&
            !isLoading.value &&
            (pagination.last_page === null || pagination.current_page <= pagination.last_page)
        ) {
            await loadMore();
        }
    };

    // Load more items using the provided API method
    const loadMore = async () => {
        if (pagination.last_page !== null && pagination.current_page > pagination.last_page) return;

        isLoading.value = true;

        // console.log('Params: ', params)

        try {
            const apiParams = {
                ...params,
                page: pagination.current_page,
            };

            const response = await apiMethod(apiParams);

            // console.log('response', response.data.links.first);

            if (pagination.current_page === 1) {
                items.value = []; // Reset items on the first load
            }

            items.value.push(...response.data.data);

            pagination.last_page = response.data.meta.last_page;
            meta.total = response.data.meta.total;

            // Only increment if there's another page to load
            if (pagination.current_page < pagination.last_page) {
                pagination.current_page += 1;
            } else {
                // Disconnect the observer when the last page is reached
                if (observer && loadMoreElement.value) {
                    observer.unobserve(loadMoreElement.value);
                    // console.log('Observer disconnected: All pages loaded');
                }
            }
        } catch (error) {
            console.error('Failed to load more items:', error);
        } finally {
            isLoading.value = false;
        }
    };

    // Function to update params and reset pagination
    const updateParams = async (newParams) => {
        // Clear all existing properties in the params object
        Object.keys(params).forEach(key => delete params[key]);

        // Assign the new parameters to params
        Object.assign(params, newParams);

        // Object.assign(params, newParams); // Update params reactively

        // Reset pagination and items
        pagination.current_page = 1;
        pagination.last_page = null;
        items.value = []; // Clear existing items

        // Fetch items with updated parameters
        await loadMore();

        // Reconnect the observer if it was previously disconnected
        if (observer && loadMoreElement.value) {
            observer.observe(loadMoreElement.value);
            // console.log('Observer reconnected: New parameters applied');
        }
    };

    return {
        loadMoreElement,
        items,
        isLoading,
        pagination,
        meta,
        updateParams,
    };
}
