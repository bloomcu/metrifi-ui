<template>
  <AppModal 
    size="lg"
    @closed="organizationStore.toggleUpdateROAAModal()" 
    :open="organizationStore.updateROAAModalOpen"
  >
    <div class="p-6">
      <form action="#" @submit.prevent="update()" class="flex flex-col gap-6">
        <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Update organization</h3>
        <AppInput v-model="computedReturnOnAssets" label="Return on average assets" append="%" :errors="errorStore.errors.return_on_assets" :maxlength="100" required/>
        <AppButton :loading="organizationStore.loading" class="w-full">Update</AppButton>
      </form>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'

const errorStore = useErrorStore()
const organizationStore = useOrganizationStore()
const inputValue = ref('');

function update() {
  // Update the org in store
  let value = inputValue.value;
  organizationStore.organization.return_on_assets = value.toFixed(2);

  organizationStore.update()
    .then(() => {
      organizationStore.toggleUpdateROAAModal()
      organizationStore.analyzeOrganizationDashboards(organizationStore.organization.slug)
    })
    .catch(error => {
      console.error('Failed to update organization:', error.response?.data || error);
    });
}

const computedReturnOnAssets = computed({
  get: () => {
    // Show raw input if available, otherwise show stored value
    if (inputValue.value !== '') {
      return inputValue.value;
    }
  },

  set: (value) => {
    // Allow digits and one optional decimal point
    value = value.replace(/[^0-9.]/g, '');

    // Handle multiple decimals by keeping only the first
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Convert to float
    let numericValue = parseFloat(value);

    // Limit between 0 and 100
    if (isNaN(numericValue)) {
      numericValue = '';
    } else if (numericValue < 0) {
      numericValue = '';
    } else if (numericValue > 100) {
      numericValue = 100;
    }

    // Store raw user input
    inputValue.value = numericValue;
  }
});

onMounted(() => {
  // Reset the input value when the modal is opened
  inputValue.value = organizationStore.organization.return_on_assets;
});
</script>
