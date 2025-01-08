<template>
    <AppDropdown>
      <template #title>
        <div class="flex items-center text-sm p-1">
          <CalendarIcon  class="mr-2 h-5 w-5" />
          {{ selectedDateRange.label }} 
          <span class="text-gray-400 ml-1">
            ({{ moment(selectedDateRange.startDate).format('MMM DD') }} - 
            {{ moment(selectedDateRange.endDate).format('MMM DD') }})
          </span>
        </div>
        <ChevronDownIcon class="ml-1 h-5 w-5 text-gray-400"/>
      </template>

      <div class="flex gap-2">
        <div class="flex flex-col">
          <template v-for="option in dateRangeOptions" >
            <button 
              v-if="option.label == 'Last 28 days' || option.label == 'Last 90 days'"
              @click="selectDateRange(option)"
              :class="selectedDateRange.label == option.label ? 'bg-gray-50 text-violet-500' : ''" 
              class="w-[14em] mb-1 text-left rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-violet-600"
            >
              {{ option.label }}
            </button>
          </template>
        </div>
      </div>
    </AppDropdown>
</template>

<script setup>
import moment from 'moment'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { CalendarIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppDropdown from '@/app/components/dropdown/AppDropdown.vue'
import { onMounted } from 'vue'

const { dateRangeOptions, selectedDateRange, selectDateRange, setCustomDataRange } = useDatePicker()

onMounted(() => {
  selectDateRange(dateRangeOptions[10])
})
</script>