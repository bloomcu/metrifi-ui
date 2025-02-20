<template>
  <div class="flex items-center justify-between gap-3 bg-violet-50 py-3 px-4">
    <div class="flex items-center gap-4">
        <span class="py-2">{{ total }}</span>
        <AppButton v-if="selected" @click="$emit('unselect')" class="text-sm text-violet-500" variant="text">
          Unselect all
        </AppButton>
    </div>

    <div class="flex items-center gap-2">
      <AppButton v-if="hasActiveFilters" @click="clearFilters" size="sm" variant="simple" class="text-sm bg-gray-100 hover:bg-violet-100 text-violet-500">
        Clear filters
      </AppButton>
      
      <!-- Filter: name -->
      <AppDropdown v-if="'name' in modelValue" class="text-sm">
        <template #title>
          <div v-if="modelValue.name">
            <span class="font-medium text-left">Name: </span>
            <span class="text-gray-500 text-left">{{ modelValue.name }}</span>
            <button @click.stop="modelValue.name = ''" class="ml-2 text-md text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <span v-else class="text-gray-500 text-left">Name</span>
        </template>
        <input v-model="modelValue.name" placeholder="Funnel name" class="w-full p-2 border-none focus:ring-0">
      </AppDropdown>

      <!-- Filter: Conversion rate -->
      <AppDropdown v-if="'conversion_rate' in modelValue" class="text-sm">
        <template #title>
          <div v-if="modelValue.conversion_rate">
            <span class="font-medium text-left">Conversion: </span>
            <span class="text-gray-500 text-left"> >= {{ modelValue.conversion_rate }}%</span>
            <button @click.stop="modelValue.conversion_rate = ''" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <span v-else class="text-gray-500 text-left">Conversion</span>
        </template>
        <input v-model="modelValue.conversion_rate" placeholder=">=" class="w-full p-2 border-none focus:ring-0">
      </AppDropdown>

      <!-- Filter: Assets -->
      <AppDropdown v-if="'assets' in modelValue" class="text-sm">
        <template #title>
          <div v-if="modelValue.assets">
            <span class="font-medium text-left">Assets: </span>
            <span class="text-gray-500 text-left"> >= {{ computedAssets }}</span>
            <button @click.stop="modelValue.assets = ''" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <span v-else class="text-gray-500 text-left">Assets</span>
        </template>
        <input v-model="computedAssets" placeholder=">=" :maxlength="18" class="w-full p-2 border-none focus:ring-0"/>
      </AppDropdown>

      <!-- Filter: Users -->
      <AppDropdown v-if="'users' in modelValue" class="text-sm">
        <template #title>
          <div v-if="modelValue.users">
            <span class="font-medium text-left">Users: </span>
            <span class="text-gray-500 text-left"> >= {{ modelValue.users }}</span>
            <button @click.stop="modelValue.users = ''" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <span v-else class="text-gray-500 text-left">Users</span>
        </template>
        <input v-model="modelValue.users" placeholder=">=" class="w-full p-2 border-none focus:ring-0">
      </AppDropdown>

      <!-- Filter: Steps -->
      <AppDropdown v-if="'steps_count' in modelValue" class="text-sm">
        <template #title>
          <div v-if="modelValue.steps_count">
            <span class="font-medium text-left">Steps: </span>
            <span class="text-gray-500 text-left"> >= {{ modelValue.steps_count }}</span>
            <button @click.stop="modelValue.steps_count = ''" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <span v-else class="text-gray-500 text-left">Steps</span>
        </template>
        <input v-model="modelValue.steps_count" placeholder=">=" class="w-full p-2 border-none focus:ring-0">
      </AppDropdown>

      <!-- Filter: Privacy -->
      <AppDropdown v-if="'privacy' in modelValue" class="text-sm">
        <template #title>
          <div v-if="modelValue.privacy">
            <span class="font-medium text-left">Sharing: </span>
            <span class="text-gray-500 text-left">{{ modelValue.privacy == '0' ? 'Anonymous' : 'Private' }}</span>
            <button @click.stop="modelValue.privacy = ''" class="ml-2 text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <span v-else class="text-gray-500 text-left">Sharing</span>
        </template>

        <div class="p-3 space-y-2">
          <!-- Anonymous Radio Button -->
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="radio" value="" v-model="modelValue.privacy" class="hidden peer"/>
            <div class="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-violet-500 peer-checked:bg-violet-500"></div>
            <span class="text-gray-700">Any</span>
          </label>

          <!-- Anonymous Radio Button -->
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="radio" value="0" v-model="modelValue.privacy" class="hidden peer"/>
            <div class="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-violet-500 peer-checked:bg-violet-500"></div>
            <span class="text-gray-700">Anonymous</span>
          </label>

          <!-- Private Radio Button -->
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="radio" value="1" v-model="modelValue.privacy" class="hidden peer"/>
            <div class="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-violet-500 peer-checked:bg-violet-500"></div>
            <span class="text-gray-700">Private</span>
          </label>
        </div>
      </AppDropdown>

      <!-- Filter: Category -->
      <CategoryPicker v-if="'category' in modelValue" v-model="category" @update:modelValue="setCategoryFilter" class="text-sm"/>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import AppDropdown from '@/app/components/dropdown/AppDropdown.vue'
import CategoryPicker from '@/app/components/category-picker/CategoryPicker.vue'

const props = defineProps({
  modelValue: Object, // This replaces `filters`,
  total: Number,
  selected: 0
});

const emit = defineEmits([
    'update:modelValue', 
    'unselect'
]);

const localFilters = reactive({ ...props.modelValue })
const category = ref(null)

// Store initial filter state
const initialFilters = { ...props.modelValue }

function setCategoryFilter(category) {
  console.log('Category', category)
  localFilters.category = category ? category.title : '';
}

function clearFilters() {
  Object.keys(localFilters).forEach(key => {
    localFilters[key] = '';
  });

  category.value = null;
}

const hasActiveFilters = computed(() => {
  return Object.keys(localFilters).some(key => localFilters[key] !== initialFilters[key]);
});

const computedAssets = computed({
  get: () => {
    let value = localFilters.assets;
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  },
  
  set: (value) => {
    value = value.replace(/\D+/g, '');
    value = value === '' ? 0 : parseInt(value);
    value = Math.min(value, 1000000000000);
    localFilters.assets = isNaN(value) ? 0 : value;
  }
});

// Watch for external prop changes and sync them to local state
watch(() => props.modelValue, (newFilters) => {
  Object.assign(localFilters, newFilters);
}, { deep: true });

// Watch for internal changes and emit updates using v-model
watch(localFilters, (updatedFilters) => {
  emit('update:modelValue', updatedFilters);
}, { deep: true });
</script>