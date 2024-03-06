import { ref, computed } from 'vue'

const isTeleporting = ref(false)
const teleportTarget = ref(null)

export const useMeasurablePicker = () => {

  const teleport = (target) => {
    if (teleportTarget.value === target) {
      stopTeleporting()
        return
    }
    startTeleporting(target)
  }

  const startTeleporting = (target) => {
    isTeleporting.value = true
    teleportTarget.value = target
  }

  const stopTeleporting = () => {
    isTeleporting.value = false
    teleportTarget.value = null
  }

  return {
    isTeleporting: computed(() => isTeleporting.value),
    teleportTarget: computed(() => teleportTarget.value),
    teleport,
    startTeleporting,
    stopTeleporting,
  }
}