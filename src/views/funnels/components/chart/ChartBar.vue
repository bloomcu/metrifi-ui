<template>
  <div @click="emit('stepSelected')" :class="enableCursorPointer ? 'cursor-pointer' : ''" class="group relative flex flex-1 h-full items-end p-1.5 rounded-lg transition-colors duration-200 hover:bg-gray-200/60">
    <!-- Controls -->
    <div v-if="enableControls" class="absolute left-4 top-4 flex gap-2 invisible group-hover:visible">
      <button @click="emit('stepExpanded')" class="flex items-center gap-1 p-1 bg-white cursor-pointer border rounded-md hover:bg-indigo-100">
        <ArrowLeftEndOnRectangleIcon class="h-5 w-5 text-indigo-600" aria-hidden="true" />
        <span class="text-sm">Details</span>
      </button>
      <button @click="emit('stepDisabled')" class="flex items-center gap-1 p-1 bg-white cursor-pointer border rounded-md hover:bg-indigo-100">
        <EyeSlashIcon class="h-5 w-5 text-indigo-600" aria-hidden="true" />
        <span class="text-sm">Disable</span>
      </button>
      <!-- <AppTooltipWrapper>
        <button @click="emit('stepExpanded')" class="p-1 bg-white cursor-pointer border rounded-md hover:bg-indigo-100">
          <ArrowsPointingOutIcon class="h-5 w-5 text-indigo-600" aria-hidden="true" />
        </button>
        <AppTooltip text="Show details" />
      </AppTooltipWrapper>
      <AppTooltipWrapper>
        <button @click="emit('stepDisabled')" class="p-1 bg-white cursor-pointer border rounded-md hover:bg-indigo-100">
          <EyeSlashIcon class="h-5 w-5 text-indigo-600" aria-hidden="true" />
        </button>
        <AppTooltip text="Disable step" />
      </AppTooltipWrapper> -->
    </div>

    <!-- Chart bar -->
    <div 
      :style="`height: ${height}%;`"
      :class="[
        updating ? 'animate-pulse' : '',
        isProjection ? 'from-indigo-400 to-indigo-500' : 'from-indigo-600 to-indigo-700'
      ]"
      class="flex-1 rounded-lg transition duration-300 bg-gradient-to-b " 
    >
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { EyeSlashIcon,  ArrowLeftEndOnRectangleIcon} from '@heroicons/vue/24/outline'
import AppTooltip from '@/app/components/base/tooltips/AppTooltip.vue'
import AppTooltipWrapper from '@/app/components/base/tooltips/AppTooltipWrapper.vue'

const props = defineProps({
  value: 0,
  max: 0,
  zoom: 0,
  updating: false,
  isProjection: false,
  enableControls: false,
  enableCursorPointer: false,
})

const emit = defineEmits(['stepSelected', 'stepExpanded', 'stepDisabled'])

// function onStepSelected() {
//   emit('stepSelected')
// }

// function onExpandStep() {
//   emit('stepExpanded')
// }

// function onDisableStep() {
//   emit('stepDisabled')
// }

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

<!-- <style lang="scss">
div {
  transform: scaleY(v-bind(height));
}
</style> -->