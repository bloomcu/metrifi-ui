<template>
    <Switch :modelValue="modelValue" @update:modelValue="updateValue" :class="[modelValue ? 'bg-violet-500' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2']">
        <span aria-hidden="true" :class="[modelValue ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
    </Switch>
</template>

<script setup>
import { ref } from 'vue'
import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '@headlessui/vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
})

const inputRef = ref()
const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
    emit('update:modelValue', value)
}

defineExpose({
    inputRef
})
</script>
