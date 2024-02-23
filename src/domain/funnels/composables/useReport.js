import { ref, watch } from 'vue'

export function useFunnels() {
  // const reports = ref([])
  const funnels = ref([])
  const pending = ref([])
  const completed = ref([])
  const active = ref({})

  const addFunnel = (funnel) => {
    funnels.value.push(funnel)
    addJob({ funnelId: funnel.id })
  }

  const addJob = (job) => {
    pending.value.push(job)
    // if (Object.keys(active.value).length === 0) {
    //   startNextJob()
    // }
  };

  const startNextJob = () => {
    if (Object.keys(active.value).length > 0) {
      completed.value.push(active.value)
    }
    if (pending.value.length > 0) {
      active.value = pending.value[0]
      pending.value.shift()
    } else {
      active.value = {}
    }
  };

  watch(active, (job) => {

    // if (job.handler && typeof job.handler === 'function') {
    //   job.handler(() => startNextJob());
    // }
  });

  const getFunnels = () => funnels.value
  const getPending = () => pending.value
  const getActive = () => active.value
  const getCompleted = () => completed.value

  return { addJob, startNextJob, getFunnels, getPending, getActive, getCompleted }
}