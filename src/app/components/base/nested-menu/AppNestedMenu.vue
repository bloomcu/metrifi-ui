<template>
    <nav>
        <div v-if="showTitle" class="mb-3">{{ title }}</div>
        
        <ul role="list" class="-mx-2 space-y-1">
            <!-- "All" option -->
            <!-- <li v-if="showAllOption" class="nested-menu__item">
                <a 
                  @click.prevent="emitSelected(null)" 
                  :class="!active ? 'nested-menu__link--current' : ''" 
                  class="nested-menu__link" 
                  href=""
                >
                  <span class="nested-menu__text">All</span>
                </a>
            </li> -->

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
