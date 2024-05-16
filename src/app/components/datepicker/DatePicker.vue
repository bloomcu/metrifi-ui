<template>
    <AppDropdown class="w-[380px]">
      <template #title>
        <div class="flex">
          <CalendarIcon  class="mr-1.5 h-5 w-5" />
          {{ selectedDateRange.label }} 
          <span class="text-gray-400 font-normal ml-1">
            ({{ moment(selectedDateRange.startDate).format('MMM DD, YYYY') }} - 
            {{ moment(selectedDateRange.endDate).format('MMM DD, YYYY') }})
          </span>
        </div>
        <ChevronDownIcon class="ml-1 h-4 w-4 text-gray-400"/>
      </template>

      <div class="flex">
        <div>
          <button 
            v-for="option in dateRangeOptions" 
            @click="selectDateRange(option)"
            :class="selectedDateRange.label == option.label ? 'bg-gray-50 text-indigo-600' : ''" 
            class="w-[10em] mb-1 text-left rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
          >
            {{ option.label }}
          </button>
        </div>

        <VueDatePicker 
          v-model="datepicker" 
          @update:model-value="handleDatePickerChange"
          :enable-time-picker="false"
          week-start="1"
          hide-offset-date
          auto-apply
          inline 
          range
        >
        </VueDatePicker>
      </div>
    </AppDropdown>
</template>

<script setup>
import moment from 'moment'
import { ref } from 'vue'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { CalendarIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppDropdown from '@/app/components/dropdown/AppDropdown.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const { dateRangeOptions, selectedDateRange, selectDateRange, setCustomDataRange } = useDatePicker()

const datepicker = ref(null)

function handleDatePickerChange(date) {
  const [startDate, endDate] = date
  setCustomDataRange(startDate, endDate)
}
</script>