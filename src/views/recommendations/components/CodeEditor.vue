<template>
  <div class="h-[82vh]" ref="editorRef"></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref()
let editorInstance = null

onMounted(async () => {
  // Dynamically import Monaco
  const monaco = await import('monaco-editor')
  const editorWorker = await import('monaco-editor/esm/vs/editor/editor.worker?worker')
  const htmlWorker = await import('monaco-editor/esm/vs/language/html/html.worker?worker')

  // Configure Monaco environment
  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'html') {
        return new htmlWorker.default()
      }
      return new editorWorker.default()
    }
  }

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