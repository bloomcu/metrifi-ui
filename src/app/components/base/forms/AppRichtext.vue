<template>
  <div v-if="editor" class="md-editor mb-1">
    <label v-if="label" class="inline-block text-sm font-medium leading-6 text-gray-900" :for="label">{{ label }}</label>
    
    <div class="bg-white rounded shadow-md p-0.5 lg:p-1 mb-1 lg:mb-1.5">
      <menu class="flex flex-wrap js-md-editor__actions">    
        <li>
          <button @click="editor.chain().focus().toggleBold().run()" class="reset md-editor__btn" type="button" title="Bold">
            <svg class="md-editor__icon icon h-[16px] w-[16px] inline-block text-inherit fill-current leading-none shrink-0" viewBox="0 0 16 16">
              <title>Bold</title>
              <g fill="currentColor">
                <path d="M3 15h7a3.988 3.988 0 0 0 2.035-7.425A3.962 3.962 0 0 0 13 5a4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1zm7-2H4V9h6a2 2 0 0 1 0 4zM4 3h5a2 2 0 0 1 0 4H4z"></path>
              </g>
            </svg>
          </button>
        </li>
        
        <li>
          <button @click="editor.chain().focus().toggleItalic().run()" class="reset md-editor__btn" type="button" title="Italic">
            <svg class="md-editor__icon icon h-[16px] w-[16px] inline-block text-inherit fill-current leading-none shrink-0" viewBox="0 0 16 16">
              <title>Italic</title>
              <g fill="currentColor">
                <path d="M6 15h3a1 1 0 0 0 0-2H7.388l3.333-10H13a1 1 0 0 0 0-2H7a1 1 0 0 0 0 2h1.612L5.279 13H3a1 1 0 0 0 0 2h3z"></path>
              </g>
            </svg>
          </button>
        </li>
      </menu>
    </div>
    
    <editor-content :value="modelValue" :editor="editor" class="appearance-none bg-white border border-gray-300 py-2 px-3 rounded-md text-[1em] leading-tight transition duration-200 outline-none placeholder:opacity-100 placeholder:text-gray-400 focus-within:border-indigo-700 w-full js-md-editor__content"/>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps({
  modelValue: { 
    type: String
  },
  label: {
    type: String
  },
})

const editor = useEditor({
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: 'form-control width-100%'
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  extensions: [
    StarterKit,
  ],
})

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss">
.ProseMirror {
  min-height: var(--space-xxxl);
}

.md-editor {
  --md-editor-btn-size: 40px;
  --md-editor-btn-icon-size: 16px;
}

.md-editor__btn {
  position: relative;
  display: flex;
  width: var(--md-editor-btn-size);
  height: var(--md-editor-btn-size);
  cursor: pointer;

  transition: transform 0.2s;

  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    inset: 0;
    background: alpha(var(--color-contrast-higher), 0.1);
    border-radius: var(--radius-sm);
    transform: scale(0.85);
    opacity: 0;

    transition: 0.2s;
  }

  &:hover {
    &::before {
      transform: scale(1);
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(2px);
  }
}

.md-editor__btn-separator {
  height: calc(var(--md-editor-btn-size)/2);
  width: 1px;
  margin: 0 var(--space-xxs);

  position: relative;
  top: calc(var(--md-editor-btn-size)/4);
  
  background-color: var(--color-contrast-lower);
}

.md-editor__icon {
  position: relative;
  z-index: 2;
  display: block;
  margin: auto;
  --size: var(--md-editor-btn-icon-size);
}
</style>
