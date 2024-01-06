<template>
  <div>
    <input type="file" name="uploader" id="uploader" ref="uploader" multiple>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import * as Filepond from 'filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import { useMediaStore } from '@/domain/base/media/store/useMediaStore'

const uploader = ref() // Input binding
const mediaStore = useMediaStore()

Filepond.registerPlugin(FilePondPluginFileValidateSize)
Filepond.registerPlugin(FilePondPluginFileValidateType)

onMounted(() => {
  const pond = Filepond.create(uploader.value, {
    maxFileSize: props.maxFileSize,
    acceptedFileTypes: props.acceptedFileTypes,
    fileValidateTypeDetectType: detectCustomFileType,
    labelFileTypeNotAllowed: 'Wrong file type',

    // Process files
    server: {
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        const cancelToken = axios.CancelToken.source()
        
        mediaStore.store(file, props.collection, props.tag, {
          onUploadProgress: event => {
            progress(e.lengthComputable, e.loaded, e.total)
          },
          cancelToken: cancelToken.token
        })
        .then((response) => {
          load(file.name)
        })
        
        return {
          // Abort callback if canceling
          abort: () => {
            cancelToken.cancel()
            abort()
          }
        }
      }
    },

    // File is initally added
    onaddfile: (error, file) => {
      if (error) { return }
    },

    // File is finished uploading
    onprocessfile: (error, file) => {
      if (error) { return }

      // Remove file from uploads list (delayed)
      setTimeout(function () {
        pond.removeFile(file)
      }.bind(this), 2000)
    }
  })
}) // End onMounted

function detectCustomFileType(source, type) {
  return new Promise((resolve, reject) => {
    if (source.name.endsWith('ttf')) resolve('font/ttf')
    if (source.name.endsWith('ttc')) resolve('font/ttc')
    if (source.name.endsWith('otf')) resolve('font/otf')
    if (source.name.endsWith('woff')) resolve('font/woff')
    if (source.name.endsWith('woff2')) resolve('font/woff2')
    if (source.name.endsWith('eot')) resolve('font/eot')
    resolve(type)
  })
}

const props = defineProps({
  collection: {
    type: String, 
    default: 'default'
  },
  tag: { 
    type: String
  },
  maxFileSize: {
    type: String,
    default: '100MB'
  },
  acceptedFileTypes: {
    type: Array,
    // default: []
    default: () => ([])
  }
})
</script>

<style lang="scss">
@import 'node_modules/filepond/dist/filepond';

.filepond--root,
.filepond--drop-label label {
  cursor: pointer;
}

.filepond--panel-root {
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-dark);
}

.filepond--credits {
  display: none;
}

.filepond--item-panel {
  background-color: var(--color-primary);
}

[data-filepond-item-state='processing-complete'] .filepond--item-panel {
  background-color: var(--color-success);
}

.filepond--file-action-button {
  cursor: pointer;
}
</style>
