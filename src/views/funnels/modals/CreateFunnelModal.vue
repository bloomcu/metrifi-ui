<template>
  <AppModal 
    size="md"
    @closed="open = false" 
    :open="open"
  >
    <form action="#" @submit.prevent="generate()" class="flex flex-col gap-3">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Generate a funnel</h3>
      <AppInput v-model="input" label="Terminal page path" placeholder="e.g., /personal/loans/home/mortgage/" required />
      <AppButton :loading="loading" class="w-full">Generate</AppButton>
    </form>
  </AppModal>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'

const props = defineProps({
    open: false,
})

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const input = ref('/personal/loans/home/home-equity-loans/')

function generate() {
  loading.value = true

  funnelApi.generate(route.params.organization, 1, {
    terminalPagePath: input.value
  }).then(response => {
    // console.log(response)
    let funnel = response.data.data
    router.push({ name: 'funnel', params: { funnel: funnel.id } })
  })
}
</script>
