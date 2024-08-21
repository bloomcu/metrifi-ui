import moment from 'moment'
import { ref } from 'vue'

const dateRangeOptions = [
  {
    label: 'Custom',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  },
  {
    label: 'Today',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  },
  {
    label: 'Yesterday',
    startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'This week',
    startDate: moment().startOf('week').format('YYYY-MM-DD'),
    endDate: moment().endOf('week').format('YYYY-MM-DD'),
  },
  {
    label: 'Last week',
    startDate: moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 7 days',
    startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 14 days',
    startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 28 days',
    startDate: moment().subtract(28, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 30 days',
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 60 days',
    startDate: moment().subtract(60, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 90 days',
    startDate: moment().subtract(90, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Quarter to date',
    startDate: moment().startOf('quarter').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 12 months',
    startDate: moment().subtract(12, 'months').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'This year',
    startDate: moment().startOf('year').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  },
  {
    label: 'Last year',
    startDate: moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
  },
]

const selectedDateRange = ref(dateRangeOptions[7])

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