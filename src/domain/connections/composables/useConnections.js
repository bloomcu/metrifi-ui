import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'

let connections = ref()
let selectedConnection = ref()

export const useConnections = () => {
  let route = useRoute()

  async function listConnections() {
    // console.log('Listing connections...')
    await connectionApi.index(
        route.params.organization
      ).then(response => {
        connections.value = response.data.data
        selectedConnection.value = response.data.data[0]
      })
  }

  function selectConnectionById(connectionId) {
    selectedConnection.value = connections.value.find(connection => connection.id === connectionId)
  }

  return {
    connections: computed(() => connections.value),
    selectedConnection: computed(() => selectedConnection.value),
    listConnections,
    selectConnectionById,
  }
}