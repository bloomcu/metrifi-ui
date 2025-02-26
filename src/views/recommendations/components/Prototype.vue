<template>
    <!-- <div ref="shadowContainer"></div> -->
     <div v-html="html" class="relative overflow-hidden rounded-md shadow-md border"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    html: String
})

// const shadowContainer = ref(null)

// onMounted(() => {
//     if (shadowContainer.value) {
//         const shadowRoot = shadowContainer.value.attachShadow({ mode: 'open' })
    
//         const content = document.createElement('div')
        
//         content.innerHTML = props.html
        
//         shadowRoot.appendChild(content)
//     }
// })
</script>