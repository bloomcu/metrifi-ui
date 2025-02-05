<template>
  <AppModal 
    size="md"
    @closed="isOpen = false" 
    :open="isOpen"
  >
    <div class="p-6">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-6 sm:truncate sm:text-2xl">Edit funnel</h3>

      <form action="#" @submit.prevent="updateFunnel()" class="flex flex-col gap-6">
        <AppInput v-model="computedValue" label="Assets per conversion" :maxlength="18"/>
        <AppButton :loading="loading" class="w-full">Update</AppButton>
      </form>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { useFunnelStore } from '@/domain/funnels/store/useFunnelStore'

const route = useRoute()
const loading = ref(false)
const funnelStore = useFunnelStore()
const isUpdating = inject('isUpdating')
const isOpen = inject('isEditConversionValueModalOpen')
const inputValue = ref('')

const computedValue = computed({
  get: () => {
    // Convert to dollars
    let value = inputValue.value / 100

    // Format to dollars
    return value.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0})
  },
  set: (value) => {
    // Remove any non-digit character:
    value = value.replace(/\D+/g, '')
    
    // Handle empty string non
    if (value === '') {
      value = 0
    }
    // Convert to integer
    value = parseInt(value);

    // Limit to max 1 trillion dollars ($1,000,000,000,000
    if (value > 1000000000000) {
      value = 1000000000000 // in cents
    }

    // Handle edge cases
    if (isNaN(value)) {
      funnelStore.funnel.conversion_value = 0;
    }

    inputValue.value = value * 100
  }
})

function updateFunnel() {
  isUpdating.value = true
  funnelStore.funnel.conversion_value = inputValue.value

  funnelApi.update(route.params.organization, route.params.funnel, {
    conversion_value: inputValue.value,
  }).then(() => {
    isOpen.value = false
    funnelStore.addFunnelJob(funnelStore.funnel) // Refresh the funnel
    setTimeout(() => isUpdating.value = false, 500);
  })
}

// watch isOpen and reset the input value when modal is closed
watch(isOpen, (open) => {
  if (open === false) {
    inputValue.value = funnelStore.funnel.conversion_value
  }
})

onMounted(() => {
  // Set the input value when model is opened
  inputValue.value = funnelStore.funnel.conversion_value
});
</script>
