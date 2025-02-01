<template>
  <AppModal 
    size="lg"
    @closed="organizationStore.toggleUpdateROAAModal()" 
    :open="organizationStore.updateROAAModalOpen"
  >
    <div class="p-6">
      <form action="#" @submit.prevent="update()" class="flex flex-col gap-6">
        <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Update organization</h3>
        <AppInput v-model="computedReturnOnAssets" label="Return on average assets" :errors="errorStore.errors.return_on_assets" :maxlength="100" required />
        <AppButton :loading="organizationStore.loading" class="w-full">Update</AppButton>
      </form>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'

const errorStore = useErrorStore()
const organizationStore = useOrganizationStore()

function update() {
  organizationStore.update()
    .then(() => {
      organizationStore.toggleUpdateROAAModal();
    })
    .catch(error => {
      // Handle the error gracefully (e.g., show an error message)
      console.error('Failed to update organization:', error.response?.data || error);
    });
}

// Temporary value to track computedReturnOnAssets user input
const inputValue = ref('');
let debounceTimeout = null;

const computedReturnOnAssets = computed({
  get: () => {
    // Show raw input while typing
    if (inputValue.value !== '') {
      return inputValue.value;
    }

    const value = organizationStore.organization.return_on_assets;

    return value !== null && value !== undefined ? value + '%' : '0.00%';
  },

  set: (value) => {
    // Store raw user input immediately
    inputValue.value = value;

    // Clear any existing debounce timer
    clearTimeout(debounceTimeout);

    // Start new debounce timer (500ms)
    debounceTimeout = setTimeout(() => {
      // Allow digits and one optional decimal point
      value = value.replace(/[^0-9.]/g, '');

      // Handle multiple decimals by keeping only the first
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }

      // Handle empty input
      // if (value === '') {
      //   value = '1.00';
      // }

      // Convert to float
      value = parseFloat(value);

      // Limit between 0.01 and 100
      if (isNaN(value)) {
        value = 0.01;
      } else if (value < 0.01) {
        value = 0.01;
      } else if (value > 100) {
        value = 100;
      }

      // Save the processed value
      organizationStore.organization.return_on_assets = value;

      // Clear raw input so formatted value is shown after debounce
      inputValue.value = '';
    }, 1500); // Adjust the delay as needed
  }
});
</script>
