import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import { googleApi } from '@/domain/services/google/api/googleApi.js'

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

  function connectToGoogle(connectionId) {
    googleApi.connect({
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      state: route.params.organization,
    })
    .then(response => {
      window.location.href = response.data.url
    })
  }

  return {
    connections: computed(() => connections.value),
    selectedConnection: computed(() => selectedConnection.value),
    listConnections,
    selectConnectionById,
    connectToGoogle
  }
}