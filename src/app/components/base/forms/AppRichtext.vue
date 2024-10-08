<template>
  <div v-if="editor" class="md-editor ">
    <label v-if="label" class="inline-block text-sm font-medium leading-6 text-gray-900" :for="label">{{ label }}</label>
    
    <div v-if="editable" class="bg-white border border-gray-300 rounded-md p-0.5 lg:p-1 mb-1 lg:mb-1.5">
      <menu class="flex flex-wrap">    
        <li>
          <button @click="editor.chain().focus().toggleBold().run()" class="relative flex w-[40px] h-[40px] cursor-pointer rounded-md hover:bg-gray-100 active:translate-y-px" type="button" title="Bold">
            <svg class="relative block m-auto w-[16px] h-[16px]" viewBox="0 0 16 16">
              <title>Bold</title>
              <g fill="currentColor">
                <path d="M3 15h7a3.988 3.988 0 0 0 2.035-7.425A3.962 3.962 0 0 0 13 5a4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1zm7-2H4V9h6a2 2 0 0 1 0 4zM4 3h5a2 2 0 0 1 0 4H4z"></path>
              </g>
            </svg>
          </button>
        </li>
        
        <li>
          <button @click="editor.chain().focus().toggleItalic().run()" class="relative flex w-[40px] h-[40px] cursor-pointer rounded-md hover:bg-gray-100 active:translate-y-px" type="button" title="Italic">
            <svg class="relative block m-auto w-[16px] h-[16px]" viewBox="0 0 16 16"><title>Italic</title><g fill="currentColor"><path d="M6 15h3a1 1 0 0 0 0-2H7.388l3.333-10H13a1 1 0 0 0 0-2H7a1 1 0 0 0 0 2h1.612L5.279 13H3a1 1 0 0 0 0 2h3z"></path></g>
            </svg>
          </button>
        </li>

        <li>
          <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" class="relative flex w-[40px] h-[40px] cursor-pointer rounded-md hover:bg-gray-100 active:translate-y-px" type="button" title="Italic">
            <span class="relative block m-auto">H1</span>
          </button>
        </li>

        <li>
          <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" class="relative flex w-[40px] h-[40px] cursor-pointer rounded-md hover:bg-gray-100 active:translate-y-px" type="button" title="Italic">
            <span class="relative block m-auto">H2</span>
          </button>
        </li>

        <li>
          <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" class="relative flex w-[40px] h-[40px] cursor-pointer rounded-md hover:bg-gray-100 active:translate-y-px" type="button" title="Italic">
            <span class="relative block m-auto">H3</span>
          </button>
        </li>
      </menu>
    </div>
    
    <EditorContent 
      :value="modelValue" 
      :editor="editor" 
      :class="[editable ? 'border border-gray-300 rounded-md p-4' : '', editorClasses]" 
      class="h-full appearance-none bg-white"
    />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { Markdown } from 'tiptap-markdown';
import StarterKit from '@tiptap/starter-kit'

const props = defineProps({
  modelValue: { 
    type: String
  },
  label: {
    type: String
  },
  editable: {
    type: Boolean,
    default: false
  },
  editorClasses: {
    type: String,
    default: ''
  }
})

const editor = useEditor({
  content: props.modelValue,
  editable: props.editable,
  extensions: [
    StarterKit,
    Markdown,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose prose-h1:my-2.5 prose-h2:my-2 prose-h3:my-1.5 !max-w-none focus:outline-none h-full min-h-40 w-full'
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
    // emit('update:modelValue', editor.storage.markdown.getMarkdown())
  },
})

const emit = defineEmits(['update:modelValue'])
</script>
