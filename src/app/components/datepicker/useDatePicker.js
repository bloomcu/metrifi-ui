import moment from 'moment'
import { ref } from 'vue'

const dateRangeOptions = [
  {
    label: 'Custom',
    key: 'custom',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  },
  {
    label: 'Today',
    key: 'today',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  },
  {
    label: 'Yesterday',
    key: 'yesterday',
    startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'This week',
    key: 'thisWeek',
    startDate: moment().startOf('week').format('YYYY-MM-DD'),
    endDate: moment().endOf('week').format('YYYY-MM-DD'),
  },
  {
    label: 'Last week',
    key: 'lastWeek',
    startDate: moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 7 days',
    key: 'last7Days',
    startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 14 days',
    key: 'last14Days',
    startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 28 days',
    key: 'last28Days',
    startDate: moment().subtract(28, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 30 days',
    key: 'last30Days',
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 60 days',
    key: 'last60Days',
    startDate: moment().subtract(60, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 90 days',
    key: 'last90Days',
    startDate: moment().subtract(90, 'days').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Quarter to date',
    key: 'quarterToDate',
    startDate: moment().startOf('quarter').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'Last 12 months',
    key: 'last12Months',
    startDate: moment().subtract(12, 'months').format('YYYY-MM-DD'),
    endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    label: 'This year',
    key: 'thisYear',
    startDate: moment().startOf('year').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  },
  {
    label: 'Last year',
    key: 'lastYear',
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