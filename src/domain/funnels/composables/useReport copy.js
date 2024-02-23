import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'

let pending = ref([])
let completed = ref([])
let active = ref({})

export const useReport = () => {
  function addJob(job) {
    pending.value.push(job)
    if (!active.value) startNextJob()
  }

  function startNextJob() {
    if (pending.value.length) {
      active.value = pending.value.shift()
      active.value.start()
    }
  }

  function setActiveJob(job) {
    active.value = job
  }

  function popCurrentJob() {
    pending.value.shift()
  }

  function addCompletedJob(job) {
    completed.value.push(job)
  }

  async function listConnections() {
    if (!connections.value) {
        console.log('Listing connections...')
        await connectionApi.index(
            route.params.organization
          ).then(response => {
            connections.value = response.data.data
            selectedConnection.value = response.data.data[0]
          })
    }
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