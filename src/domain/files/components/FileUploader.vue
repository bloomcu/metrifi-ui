<template>
    <div class="relative flex flex-col items-center border border-gray-300 rounded-lg overflow-hidden">
        <!-- Drag area -->
        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-full cursor-pointer bg-white hover:bg-gray-50">
            <div class="flex flex-col items-center justify-center text-center p-6">
                <CloudArrowUpIcon class="h-7 w-7 mb-2 text-gray-500" />
                <p class="text-xs text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                <!-- <p class="text-xs text-gray-500">SVG, PNG, JPG or GIF (max 1GB)</p> -->
            </div>
            <input multiple accept="*" @change="onInputChange($event)" id="dropzone-file" type="file" class="absolute inset-0 z-50 p-0 m-0 w-full h-full top-0 right-0 opacity-0 cursor-pointer" />
        </label>

        <!-- Dropped files -->
        <ul v-if="files.length"class="w-full divide-y divide-gray-200 border-t">
            <li v-for="file in files" :key="file.id" class="flex items-center justify-between gap-x-6 p-3">
                <div class="flex items-center min-w-0 gap-x-4">
                <img class="h-16 w-20 flex-none rounded-md border border-gray-200 bg-gray-50 object-cover" :src="file.url" :alt="file.file.name" :title="file.file.name" />
                <div class="min-w-0 flex-auto">
                    <p class="text-sm font-semibold leading-6 text-gray-900">{{ file.file.name }}</p>
                    <p class="mt-1 truncate text-xs leading-5 text-gray-500">{{ file.file.size }}</p>
                </div>
                </div>
                <span v-if="file.status" class="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">{{ file.status }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFileStore } from '@/domain/files/store/useFileStore'
import { CloudArrowUpIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const fileStore = useFileStore()

const files = ref([])

function onInputChange(e) {
  addFiles(e.target.files)
  e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
}

function addFiles(droppedFiles) {
  // Build uploadable files
  let uploadables = [...droppedFiles].map((file) => ({
    file: file,
    id: `${file.name}-${file.size}-${file.lastModified}-${file.type}`,
    url: URL.createObjectURL(file),
    status: null,
  })).filter((file) => !fileExists(file.id));

  // Update ref
  files.value = files.value.concat(uploadables);

  uploadFiles()
}

function fileExists(checkId) {
  return files.value.some(({ id }) => id === checkId);
}

function uploadFiles() {
    return Promise.all(files.value.map((file) => {
        file.status = 'Uploading'

        fileStore.store(route.params.organization, file.file).then(response => {
            file.status = 'Uploaded'
        }).catch(error => {
            console.error(error)
            file.status = 'Failed'
        })
  }))
}
</script>