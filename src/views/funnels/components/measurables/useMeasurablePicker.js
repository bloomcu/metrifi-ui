import { ref, computed } from 'vue'

// const isMeasurablePickerOpen = ref(false)
const measurablePickerTarget = ref(null)

export const useMeasurablePicker = () => {

  const setMeasurablePickerTarget = (target) => {
    if (measurablePickerTarget.value === target) {
      measurablePickerTarget.value = null
    }
    measurablePickerTarget.value = target
  }

  const closeMeasurablePicker = () => {
    measurablePickerTarget.value = null
  }

  // const toggle = (target) => {
  //   if (measurablePickerTarget.value === target) {
  //     hide()
  //       return
  //   }
  //   show(target)
  // }

  // const show = (target) => {
  //   isMeasurablePickerOpen.value = true
  //   measurablePickerTarget.value = target
  // }

  // const hide = () => {
  //   isMeasurablePickerOpen.value = false
  //   measurablePickerTarget.value = null
  // }

  return {
    // pickerId: computed(() => pickerId.value),
    // isMeasurablePickerOpen: computed(() => isMeasurablePickerOpen.value),
    measurablePickerTarget: computed(() => measurablePickerTarget.value),
    setMeasurablePickerTarget,
    closeMeasurablePicker,
    // toggleMeasurablePicker: toggle
  }
}