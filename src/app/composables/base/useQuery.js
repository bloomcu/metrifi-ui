import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

let query = ref({})

export default function useQuery() {
  const router = useRouter()

  /**
   * Add a query param and value to current route
   * @param  {String} parameter
   * @param  {String} value
   */
  function set(parameter, value) {
    Object.assign(query.value, {...query.value, [parameter]: value})
    syncRoute()
  }

  /**
   * Remove a query param
   * @param  {String} parameter
   */
  function unset(parameter) {
    delete query.value[parameter]
    syncRoute()
  }
  
  /**
   * Remove all query params
   */
  function unsetAll() {
    query.value = {}
    syncRoute()
  }
  
  /**
   * Replace all query params
   * @param  {String} parameter
   * @param  {String} value
   */
  function replaceAll(parameter, value) {
    unsetAll()
    set(parameter, value)
    syncRoute()
  }
  
  /**
   * Toggle the value of a specific param
   * @param  {String} parameter
   * @param  {String} value
   */
  function toggle(parameter, value) {
    query.value[parameter] === value ? unset(parameter) : set(parameter, value)
  }

  /**
   * Sync route with current query object
   */
  function syncRoute() {
    router.replace({ query: query.value })
  }
  
  onMounted(() => {
    let route = useRoute()
    Object.assign(query.value, route.query)
  })
  
  onUnmounted(() => {
    query.value = {}
  })

  return {
    query,
    set,
    unset,
    unsetAll,
    replaceAll,
    toggle
  }
}
