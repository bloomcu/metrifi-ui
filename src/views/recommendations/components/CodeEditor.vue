<template>
  <vue-monaco-editor
    v-model:value="code"
    theme="vs-dark"
    language="html"
    :options="editorOptions"
    class="h-[82vh]"
    @mount="handleMount"
  />
</template>

<script setup>
import { ref, shallowRef, watch } from 'vue'
import { VueMonacoEditor, loader } from '@guolao/vue-monaco-editor'

// Configure Monaco loader to use CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
  }
})

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editorOptions = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  minimap: { enabled: false },
  fontSize: 14,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on'
}

const code = ref(props.modelValue)
const editor = shallowRef()

const handleMount = (editorInstance) => {
  editor.value = editorInstance
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue !== code.value) {
    code.value = newValue
  }
})

// Watch for internal changes to code
watch(() => code.value, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>