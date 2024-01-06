<template>
  <div class="card card--dark cursor-pointer">
    <!-- Header -->
    <div @click="open = !open" class="card-header flex items-center">
      <figure class="margin-right-xs">
        <Avatar :name="user.name" size="md"/>
      </figure>
    
      <div class="text-component text-sm line-height-sm text-space-y-xxs">
        <p><strong>{{ user.name }}</strong></p>
        <p class="text-sm color-contrast-medium">{{ user.organization }} – {{ user.role }}</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div v-show="open" class="card-footer border-top margin-top-sm padding-top-sm">
      <div class="flex flex-column gap-sm text-sm">
        <a :href="`mailto:${user.email}`" class="flex items-center">
          <svg class="icon--xs icon color-primary margin-right-xxs" viewBox="0 0 16 16">
            <g fill="currentColor"><path d="M15,1H1C0.448,1,0,1.447,0,2v12c0,0.553,0.448,1,1,1h14c0.552,0,1-0.447,1-1V2C16,1.447,15.552,1,15,1z M14,13H2V6.723l5.504,3.145c0.308,0.176,0.685,0.176,0.992,0L14,6.723V13z M14,4.42L8,7.849L2,4.42V3h12V4.42z"></path></g>
          </svg>
          {{ user.email }}
        </a>
        <a v-if="user.mobile" :href="`tel:${user.mobile}`" class="flex items-center">
          <svg class="icon--xs icon color-primary margin-right-xxs" viewBox="0 0 16 16">
            <g fill="currentColor"><path d="M8,0h7a1,1,0,0,1,1,1V5a1,1,0,0,1-1,1H10L7,8V1A1,1,0,0,1,8,0Z" data-color="color-2"></path><path d="M10,7v6H3V4H6V1H3A2,2,0,0,0,1,3V14a2,2,0,0,0,2,2h7a2,2,0,0,0,2-2V7Z"></path></g>
          </svg>
          {{ user.mobile }}
        </a>
        <a v-if="user.office" :href="`tel:${user.office}`" class="flex items-center">
          <svg class="icon--xs icon color-primary margin-right-xxs" viewBox="0 0 16 16">
            <g fill="currentColor"><path d="M13.167,11.021,10.45,9.814a1.4,1.4,0,0,0-1.662.4l-.783.979A10.7,10.7,0,0,1,4.8,8l.979-.783a1.4,1.4,0,0,0,.4-1.661l-1.2-2.724a1.4,1.4,0,0,0-1.632-.787l-2.3.6A1.4,1.4,0,0,0,.014,4.2,13.911,13.911,0,0,0,11.806,15.986a1.4,1.4,0,0,0,1.552-1.037l.6-2.3A1.394,1.394,0,0,0,13.167,11.021Z"></path><path data-color="color-2" d="M10,8a1,1,0,0,0,2,0A4,4,0,0,0,8,4,1,1,0,0,0,8,6,2,2,0,0,1,10,8Z"></path><path data-color="color-2" d="M8,0A1,1,0,0,0,8,2a6.006,6.006,0,0,1,6,6,1,1,0,0,0,2,0A8.009,8.009,0,0,0,8,0Z"></path></g>
          </svg>
          {{ user.office }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Avatar from '@/app/components/base/avatars/Avatar.vue'

const props = defineProps({
  user: { 
    type: Object,
    required: true,
  },
})

const open = ref(true)
</script>
