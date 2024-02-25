import moment from 'moment'
import { ref } from 'vue'

const dateRangeOptions = [
    {
      label: 'Yesterday',
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    },
    {
      label: 'Last 7 days',
      startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    },
    {
      label: 'Last 28 days',
      startDate: moment().subtract(28, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    },
]

const selectedDateRange = ref(dateRangeOptions[2])

export const useDatePicker = () => {
  
  const selectDateRange = (dateRange) => {
    selectedDateRange.value = dateRange
  }

  const setCustomDataRange = (startDate, endDate) => {
    selectedDateRange.value = {
      label: 'Custom',
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD')
    }
  }

  return {
    dateRangeOptions, 
    selectedDateRange, 
    selectDateRange,
    setCustomDataRange
  }
}