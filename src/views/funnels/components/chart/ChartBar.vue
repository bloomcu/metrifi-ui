<template>
  <div @click="emit('stepSelected')" :class="enableCursorPointer ? 'cursor-pointer' : ''" class="group relative flex flex-1 h-full items-end p-1.5 rounded-lg transition-colors duration-200 hover:bg-gray-200/60">
    <div v-if="enableControls">
      <div class="absolute left-3 top-3 flex gap-1.5 invisible group-hover:visible">
        <button v-if="enableStepExpansion" @click="emit('stepExpanded')" class="flex items-center gap-0.5 p-1 bg-white cursor-pointer border rounded-md hover:bg-violet-100">
          <ArrowLeftEndOnRectangleIcon class="h-5 w-5 text-violet-500" aria-hidden="true" />
        </button>
        <button @click="emit('stepDisabled')" class="flex items-center gap-0.5 p-1 bg-white cursor-pointer border rounded-md hover:bg-violet-100">
          <EyeSlashIcon class="h-5 w-5 text-violet-500" aria-hidden="true" />
        </button>
      </div>

      <div class="absolute right-3 top-3">
        <button v-if="enableGenerateRecommendation" @click="emit('generateRecommendation')" class="flex items-center gap-0.5 p-1.5 bg-[#99FFCC] cursor-pointer rounded-md hover:bg-[#89e7b8]">
          <BoltIcon class="h-4 w-4" aria-hidden="true" />
          <span class="text-xs font-medium">Improve</span>
        </button>
      </div>
    </div>
    <div 
      :style="`height: ${height}%;`"
      :class="[
        updating ? 'animate-pulse' : '',
        isProjection ? 'from-violet-400 to-violet-500' : 'from-violet-600 to-violet-600'
      ]"
      class="flex-1 rounded-lg transition duration-300 bg-gradient-to-b " 
    >
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { EyeSlashIcon,  ArrowLeftEndOnRectangleIcon, BoltIcon} from '@heroicons/vue/24/outline'

const props = defineProps({
  value: 0,
  max: 0,
  zoom: 0,
  updating: false,
  isProjection: false,
  enableControls: false,
  enableStepExpansion: false,
  enableGenerateRecommendation: false,
  enableCursorPointer: false,
})

const emit = defineEmits(['stepSelected', 'stepExpanded', 'stepDisabled', 'generateRecommendation'])

const height = computed(() => {
  let value = props.value
  let max = props.max
  let zoom = props.zoom
  
  if (value == 0) {
    return 0
  } 

  // Set the height to the value divided by the max
  let h = value / max
  
  // If the zoom is greater than 0, set the height to the value divided by the max, then multiply by the zoom
  if (zoom > 0) {
    h = value / max * zoom
  }

  // If the value is greater than 1, set it to 1
  if (h > 1 || value === max) {
    h = 1
  }

  return h * 100
})
</script>