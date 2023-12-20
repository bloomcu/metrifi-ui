<template>
  <AppButton @click="copy(value)" variant="tertiary">
    <slot v-if="!copying"/>
    <span v-if="copying">Copied</span>
  </AppButton>
</template>

<script setup>
import { ref } from 'vue'
import useClipboard from '@/app/composables/base/useClipboard'

const props = defineProps({
  value: {
    type: String,
    required: true
  }
})

const { copyToClipboard } = useClipboard()

let copying = ref(false)

function copy(value) {
  copying.value = true
  copyToClipboard(value)  
  
  // setTimeout(function () {
  //   copying.value = false
  // }.bind(this), 2000)
}
</script>
