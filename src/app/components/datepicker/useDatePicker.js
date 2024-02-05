import moment from 'moment'
import { ref } from 'vue'

const dateRangeOptions = [
    {label: 'Yesterday',    startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),  endDate: 'yesterday'},
    // {label: 'This week',    startDate: moment().startOf('week').format('YYYY-MM-DD'),      endDate: 'today'},
    {label: 'Last 7 days',  startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),  endDate: 'yesterday'},
    {label: 'Last 28 days', startDate: moment().subtract(28, 'days').format('YYYY-MM-DD'), endDate: 'yesterday'},
]

const selectedDateRange = ref(dateRangeOptions[1])

export const useDatePicker = () => {

  const selectDateRange = (dateRange) => {
    selectedDateRange.value = dateRange
  }

  return {
    dateRangeOptions, 
    selectedDateRange, 
    selectDateRange
  }
}