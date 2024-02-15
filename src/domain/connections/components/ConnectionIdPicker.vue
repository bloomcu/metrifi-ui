<template>
    <div class="flex flex-col gap-2">
      <label v-if="showLabel" class="block text-sm font-medium text-gray-900">Connection</label>
      <AppDropdown>
        <template #title>
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
            {{ selectedConnection ? selectedConnection.name : 'Select connection' }}
          </div>
          <ChevronDownIcon class="ml-auto h-4 w-4 text-gray-400"/>
        </template>
        <button 
          v-for="connection in connections" 
          @click="updateValue(connection.id)"
          :class="modelValue == connection.id ? 'bg-gray-50 text-indigo-600' : ''" 
          class="w-full text-left rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
        >
          {{ connection.name }}
        </button>
      </AppDropdown>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useConnections } from '@/domain/connections/composables/useConnections'
import AppDropdown from '@/app/components/dropdown/AppDropdown.vue'

const { selectConnectionById } = useConnections()

const props = defineProps({
  modelValue: { 
      type: [String, Number]
  },
  connections: {
    type: Array,
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
})

function updateValue(connectionId) {
  emit('update:modelValue', connectionId)
  selectConnectionById(connectionId)
}

const selectedConnection = computed(() => {
    return props.connections.find(connection => connection.id == props.modelValue)
})

const emit = defineEmits(['update:modelValue'])
</script>