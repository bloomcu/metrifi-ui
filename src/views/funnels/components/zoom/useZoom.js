import { ref } from 'vue'

const zoomOptions = [
    {label: 'No zoom', value: 0},
    {label: 'Zoom: Low', value: 40},
    {label: 'Zoom: Middle', value: 80},
    {label: 'Zoom: High', value: 120},
]

export const useZoom = () => {

  const selectZoom = (dateRange) => {
    selectedDateRange.value = dateRange
  }

  return {
    dateRangeOptions, 
    selectedDateRange, 
    selectDateRange
  }
}