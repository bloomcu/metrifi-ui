<template>
    <Dropdown>
      <template #title>
        <CalendarIcon  class="mr-1.5 h-5 w-5" />
        {{ selectedDateRange.label }} 
        <span class="text-gray-400 font-normal ml-1">({{ moment(selectedDateRange.startDate).format('MMM DD, YYYY') }} - {{ selectedDateRange.endDate }})</span>
      </template>
      <button 
        v-for="option in dateRangeOptions" 
        @click="selectDateRange(option)"
        :class="option == selectedDateRange ? 'bg-gray-50 text-indigo-600' : ''" 
        class="w-full text-left rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
      >
        {{ option.label }}
      </button>
    </Dropdown>
</template>

<script setup>
import moment from 'moment'
import { useDateRange } from '@/app/composables/useDateRange'
import { CalendarIcon } from '@heroicons/vue/24/outline'
import Dropdown from '@/views/dashboard/components/Dropdown.vue'

const { dateRangeOptions, selectedDateRange, selectDateRange } = useDateRange()
</script>