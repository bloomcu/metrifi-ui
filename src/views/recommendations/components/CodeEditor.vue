<template>
  <div class="h-[82vh]" ref="editorRef"></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'

// Configure Monaco environment to use workers
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'html') {
      return new htmlWorker()
    }
    return new editorWorker()
  }
}

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref()
let editorInstance = null

onMounted(() => {
  // Configure HTML formatting options
  monaco.languages.html.htmlDefaults.setOptions({
    format: {
      tabSize: 2,
      insertSpaces: true,
      wrapLineLength: 120,
      unformatted: '',
      contentUnformatted: 'pre',
      indentInnerHtml: true
    }
  })

  // Create the editor
  editorInstance = monaco.editor.create(editorRef.value, {
    value: props.modelValue,
    language: 'html',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    formatOnType: true,
    formatOnPaste: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on'
  })

  // Sync editor changes with parent
  editorInstance.onDidChangeModelContent(() => {
    emit('update:modelValue', editorInstance.getValue())
  })
})

watch(() => props.modelValue, (newValue) => {
  if (editorInstance && newValue !== editorInstance.getValue()) {
    editorInstance.setValue(newValue)
  }
})

onUnmounted(() => {
  if (editorInstance) {
    editorInstance.dispose()
  }
})
</script>