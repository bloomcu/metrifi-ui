import { ref, computed } from 'vue'

const measurablePickerTab = ref(null)
const measurablePickerTarget = ref(null)

export const useMeasurablePicker = () => {
  const setMeasurablePickerTab = (tab) => {
    measurablePickerTab.value = tab
  }

  const setMeasurablePickerTarget = (target) => {
    if (measurablePickerTarget.value === target) {
      measurablePickerTarget.value = null
    }
    measurablePickerTarget.value = target
  }

  const closeMeasurablePicker = () => {
    measurablePickerTarget.value = null
  }

  return {
    measurablePickerTab: computed(() => measurablePickerTab.value),
    measurablePickerTarget: computed(() => measurablePickerTarget.value),
    setMeasurablePickerTab,
    setMeasurablePickerTarget,
    closeMeasurablePicker,
  }
}