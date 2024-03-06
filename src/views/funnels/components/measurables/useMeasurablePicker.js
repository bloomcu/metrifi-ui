import { ref, computed } from 'vue'

const isMeasurablePickerOpen = ref(false)
const measurablePickerTarget = ref(null)

export const useMeasurablePicker = () => {

  const toggle = (target) => {
    if (measurablePickerTarget.value === target) {
      hide()
        return
    }
    show(target)
  }

  const show = (target) => {
    isMeasurablePickerOpen.value = true
    measurablePickerTarget.value = target
  }

  const hide = () => {
    isMeasurablePickerOpen.value = false
    measurablePickerTarget.value = null
  }

  return {
    isMeasurablePickerOpen: computed(() => isMeasurablePickerOpen.value),
    measurablePickerTarget: computed(() => measurablePickerTarget.value),
    toggleMeasurablePicker: toggle
  }
}