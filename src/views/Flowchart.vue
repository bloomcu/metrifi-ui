<template>
  <div class="funnel-wrapper">
    <div class="funnel" @drop="onDrop">
      <VueFlow v-model="elements" :node-types="nodeTypes" @dragover="onDragOver" class="vue-flow">

        <!-- <Background /> -->
        <MiniMap />
        <Controls />
        <!-- <div style="position: absolute; right: 10px; top: 10px; z-index: 4">
          <button style="margin-right: 5px" @click="resetTransform">reset transform</button>
          <button style="margin-right: 5px" @click="toggleclass">toggle class</button>
          <button @click="logToObject">toObject</button>
        </div> -->
      </VueFlow>
      
      <!-- <FlowchartSidebar/> -->
      <aside> 
        <div class="vue-flow__node-input" :draggable="true" @dragstart="(event: DragEvent) => onDragStart(event, 'input')">Input Node</div>
        <div class="vue-flow__node-default" :draggable="true" @dragstart="(event: DragEvent) => onDragStart(event, 'default')">Default Node</div>
        <div class="vue-flow__node-output" :draggable="true" @dragstart="(event: DragEvent) => onDragStart(event, 'output')">Output Node</div>
        
        <div class="updatenode__controls">
          <label>label:</label>
          <input v-model="opts.label" @input="updateNode" />

          <label class="updatenode__bglabel">background:</label>
          <input v-model="opts.bg" type="color" @input="updateNode" />

          <div class="updatenode__checkboxwrapper">
            <label>hidden:</label>
            <input v-model="opts.hidden" type="checkbox" @change="updateNode" />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, markRaw } from 'vue'
import { VueFlow, MiniMap, Controls, Background, Node, isNode, useVueFlow } from '@braks/vue-flow'
// import FlowchartSidebar from './components/FlowchartSidebar.vue'
import FlowchartNode from '@/components/FlowchartNode.vue'

const { onPaneReady, onNodeDragStop, onConnect, instance, nodes, getNode, edges, addEdges, addNodes } = useVueFlow({
  // defaultPosition: [200, 200],
  defaultZoom: 1,
  minZoom: 0.5,
  maxZoom: 2,
})

const nodeTypes = {
  custom: markRaw(FlowchartNode)
}

const elements = ref([
  { id: '1', type: 'custom', data: { label: 'Node 1', image: 'https://landingfoliocom.imgix.net/1650250080433-surge-landing-page-desktop.png?lossless=true&q=75&crop=top,left&fit=crop&auto=format&w=380&h=380' }, position: { x: 0, y: 175 } },
  { id: '2', type: 'custom', data: { label: 'Node 2', image: 'https://landingfoliocom.imgix.net/1650511669657-designup-landing-page-desktop.png?lossless=true&q=75&crop=top,left&fit=crop&auto=format&w=380&h=380' }, position: { x: 300, y: 0 } },
  { id: '3', type: 'custom', data: { label: 'Node 3', image: 'https://landingfoliocom.imgix.net/1612751234064-gingertag-landing-page-desktop.png?lossless=true&q=75&crop=top,left&fit=crop&auto=format&w=380&h=380' }, position: { x: 300, y: 350 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
])

onPaneReady(({ fitView, zoomTo }) => {
  fitView()
  zoomTo(1)
})

onNodeDragStop((e) => console.log('Drag stop', e))

onConnect((params) => addEdges([params]))

// Update node
const opts = reactive({
  bg: '#eeeeee',
  label: 'Node 1',
  hidden: false,
})

const updateNode = () => {
  const node = getNode.value('1')
  node.label = opts.label.trim() !== '' ? opts.label : 'Default Label'
  // node.style = { backgroundColor: opts.bg }
  node.data.color = opts.bg
  node.hidden = opts.hidden
}

// Drag
const onDragStart = (event: DragEvent, nodeType: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
}

// Drop
let id = 0
const getId = () => `dndnode_${id++}`

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onDrop = (event: DragEvent) => {
  if (instance.value) {
    const type = event.dataTransfer?.getData('application/vueflow')
    const position = instance.value.project({ x: event.clientX - 80, y: event.clientY - 40 })
    const newNode = {
      id: getId(),
      type,
      position,
      label: `${type} node`,
    } as Node
    addNodes([newNode])
  }
}

// Buttons
const logToObject = () => console.log(instance.value?.toObject())
const resetTransform = () => instance.value?.setTransform({ x: 0, y: 0, zoom: 1 })
const toggleclass = () => elements.value.forEach((el) => (el.class = el.class === 'light' ? 'dark' : 'light'))
</script>



<style>
/* these are necessary styles for vue flow */
@import '@braks/vue-flow/dist/style.css';

/* this contains the default theme, these are optional styles */
@import '@braks/vue-flow/dist/theme-default.css';
</style>

<style scoped>
body {
  margin: 0;
  background-color: #fafafa;
}

.funnel-wrapper {
  height: 100vh;
}

.funnel {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.vue-flow {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

aside {
  max-width: 180px;
  border-left: 1px solid #eee;
  padding: 15px;
}
</style>
