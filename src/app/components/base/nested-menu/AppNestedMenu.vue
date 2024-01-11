<template>
    <nav>
        <div v-if="showTitle" class="text-xs font-semibold leading-6 text-gray-400">{{ title }}</div>
        
        <ul role="list" class="-mx-2 space-y-1">
            <button v-if="showAllOption" @click.prevent="emitSelected(null)" :class="!active ? 'bg-gray-100 ' : ''" class="flex items-center w-full text-left rounded-md mt-1 p-2 gap-x-3 text-sm leading-6 text-gray-700 hover:bg-gray-100">All</button>

            <!-- Children -->
            <AppNestedMenuChildren :options="options" :active="active" @selected="emitSelected" />
        </ul>
    </nav>
</template>

<script setup>
import AppNestedMenuChildren from '@/app/components/base/nested-menu/AppNestedMenuChildren.vue'

const props = defineProps({
    options: { 
      type: Object,
      required: true
    },
    title: { 
      type: String
    },
    active: {
      type: String
    },
    showTitle: {
      type: Boolean,
      default: false
    },
    showAllOption: {
      type: Boolean,
      default: true
    },
})

const emit = defineEmits(['selected'])

function emitSelected(value) {
  emit('selected', value)
}
</script>
