<template>
    <div class="flex items-center justify-between gap-3 bg-violet-50 py-3 px-4 rounded-lg mb-4">
        <div>{{ meta.total }} funnels</div>

      <div class="flex items-center gap-2">
        <AppButton v-if="hasActiveFilters" @click="clearFilters" size="sm" variant="simple" class="text-sm bg-gray-100 hover:bg-violet-100 text-violet-500">
            Clear filters
        </AppButton>
        
        <!-- Filter: name -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.name">
                <span class="font-medium text-left">Name: </span>
                <span class="text-gray-500 text-left">{{ filters.name }}</span>
                <button @click.stop="filters.name = ''; updateFilterParams()" class="ml-2 text-md text-gray-400 hover:text-gray-600">&times;</button>
              </div>
              <span v-else class="text-gray-500 text-left">Name</span>
          </template>
          <input v-model="filters.name" @input="updateFilterParams" placeholder="Funnel name" class="w-full p-2 border-none focus:ring-0">
        </AppDropdown>

        <!-- Filter: Conversion rate -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.conversion_rate">
                <span class="font-medium text-left">Conversion rate: </span>
                <span class="text-gray-500 text-left"> >= {{ filters.conversion_rate }}%</span>
                <button @click.stop="filters.conversion_rate = ''; updateFilterParams()" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
              </div>
              <span v-else class="text-gray-500 text-left">Conversion rate</span>
          </template>
          <input v-model="filters.conversion_rate" @input="updateFilterParams" placeholder=">=" class="w-full p-2 border-none focus:ring-0">
        </AppDropdown>

        <!-- Filter: Assets -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.assets">
                <span class="font-medium text-left">Assets: </span>
                <span class="text-gray-500 text-left"> >= {{ computedAssets }}</span>
                <button @click.stop="filters.assets = ''; updateFilterParams()" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
              </div>
              <span v-else class="text-gray-500 text-left">Assets</span>
          </template>
          <input v-model="computedAssets" placeholder=">=" :maxlength="18" class="w-full p-2 border-none focus:ring-0"/>
        </AppDropdown>

        <!-- Filter: Users -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.users">
                <span class="font-medium text-left">Users: </span>
                <span class="text-gray-500 text-left"> >= {{ filters.users }}</span>
                <button @click.stop="filters.users = ''; updateFilterParams()" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
              </div>
              <span v-else class="text-gray-500 text-left">Users</span>
          </template>
          <input v-model="filters.users" @input="updateFilterParams" placeholder=">=" class="w-full p-2 border-none focus:ring-0">
        </AppDropdown>

        <!-- Filter: Steps -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.steps_count">
                <span class="font-medium text-left">Steps: </span>
                <span class="text-gray-500 text-left"> >= {{ filters.steps_count }}</span>
                <button @click.stop="filters.steps_count = ''; updateFilterParams()" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
              </div>
              <span v-else class="text-gray-500 text-left">Steps</span>
          </template>
          <input v-model="filters.steps_count" @input="updateFilterParams" placeholder=">=" class="w-full p-2 border-none focus:ring-0">
        </AppDropdown>

        <!-- Filter: Privacy -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.privacy">
                <span class="font-medium text-left">Sharing: </span>
                <span class="text-gray-500 text-left">{{ filters.privacy == '0' ? 'Anonymous' : 'Private' }}</span>
                <button @click.stop="filters.privacy = ''; updateFilterParams()" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
              </div>
              <span v-else class="text-gray-500 text-left">Sharing</span>
          </template>

          <div class="p-3 space-y-2">
            <!-- Anonymous Radio Button -->
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" value="" v-model="filters.privacy" class="hidden peer"/>
              <div class="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-violet-500 peer-checked:bg-violet-500"></div>
              <span class="text-gray-700">Any</span>
            </label>

            <!-- Anonymous Radio Button -->
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" value="0" v-model="filters.privacy" class="hidden peer"/>
              <div class="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-violet-500 peer-checked:bg-violet-500"></div>
              <span class="text-gray-700">Anonymous</span>
            </label>

            <!-- Private Radio Button -->
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" value="1" v-model="filters.privacy" class="hidden peer"/>
              <div class="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-violet-500 peer-checked:bg-violet-500"></div>
              <span class="text-gray-700">Private</span>
            </label>
          </div>
        </AppDropdown>

        <!-- Filter: Category -->
        <CategoryPicker v-model="category" @update:modelValue="setCategoryFilter" class="text-sm"/>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { adminFunnelApi } from '@/domain/admin/api/adminFunnelApi.js'
import { useInfiniteScroll } from '@/app/composables/base/useInfiniteScroll'
import AppDropdown from '@/app/components/dropdown/AppDropdown.vue'
import CategoryPicker from '@/app/components/category-picker/CategoryPicker.vue'

const { 
    meta,
    updateParams
} = useInfiniteScroll(adminFunnelApi.index, {}, { sort: '' })

const category = ref(null)

const filters = reactive({
  name: '',
  assets: '',
  conversion_rate: '',
  users: '100',
  steps_count: '3',
  privacy: '0',
  category: '',
})

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const updateFilterParams = debounce(() => {
  const formattedFilters = Object.fromEntries(
    Object.entries(filters)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '') // Avoid empty values
      .map(([key, value]) => [`filter[${key}]`, value])
  );

  const queryParams = {
    ...formattedFilters,
  };

  updateParams(queryParams);
}, 300); // 300ms debounce delay

function setCategoryFilter(category) {
  if (category === null) {
    filters.category = ''
    return
  }

  filters.category = category.title
}

function clearFilters() {
  filters.name = '';
  filters.assets = '';
  filters.conversion_rate = '';
  filters.users = '';
  filters.steps_count = '';
  filters.privacy = '';
  filters.category = '';

  category.value = null;

  updateFilterParams(filters); // Ensure the filters are applied immediately
}

const hasActiveFilters = computed(() => {
  return Object.values(filters).some((filter) => filter !== null && filter !== '');
});

const computedAssets = computed({
  get: () => {
    // Convert to dollars
    let value = filters.assets

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
      filters.assets = 0;
    }

    // Convert to cents
    filters.assets = value;
  }
})

// Watch filters
watch(filters, (updatedFilters) => {
  updateFilterParams(updatedFilters)
})
</script>