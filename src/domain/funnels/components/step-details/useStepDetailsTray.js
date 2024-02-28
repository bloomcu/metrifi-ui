import { ref, computed } from 'vue'

const isOpen = ref(false)
const selectedStep = ref(null)

export const useStepDetailsTray = () => {

  const openTray = () => {
    isOpen.value = true
  }

  const closeTray = () => {
    isOpen.value = false
  }

  const selectStep = (step) => {
    selectedStep.value = step
  }

  const toggleTray = () => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen: computed(() => isOpen.value),
    selectedStep: computed(() => selectedStep.value),
    openTray,
    closeTray,
    toggleTray,
    selectStep,
  }
}