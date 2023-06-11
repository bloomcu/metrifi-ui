<template>
  <LayoutDefault v-if="siteStore.site">
    <div class="container max-width-sm padding-y-md">
      <div class="margin-bottom-md">
        <RouterLink :to="{ name: 'sites' }" class="btn btn--subtle margin-bottom-md">
          <IconAngleLeft size="xs" class="color-primary"/>
          <span class="margin-left-xxs">Back</span>
        </RouterLink>
        
        <h1 class="text-lg">{{ siteStore.site.domain }}</h1>
      </div>
      
      <form action="#" @submit.prevent="update()">
        <!-- General -->
        <div class="card card--shadow margin-bottom-md">
          <div class="margin-bottom-sm">
            <p class="text-bold">General</p>
          </div>
          
          <AppInput v-model="siteStore.site.title" label="Title" required />
          <AppInput v-model="siteStore.site.domain" label="Domain" required />
        </div>
        
        <!-- Launch info -->
        <div class="card card--shadow margin-bottom-md">
          <div class="margin-bottom-sm">
            <p class="text-bold">Launch info</p>
          </div>
          
          <AppInput v-model="siteStore.launch.launch_date" label="Launch date" type="datetime-local"/>
          <AppInput v-model="siteStore.launch.freeze_date" label="Freeze date" type="datetime-local"/>
          <AppInput v-model="siteStore.launch.dev_domain" label="Development server domain" />
          <AppInput v-model="siteStore.launch.prod_domain" label="Production server domain" />
          <AppInput v-model="siteStore.launch.prod_ip" label="Production server IP" />
          <AppRichtext v-model="siteStore.launch.notes" label="Notes"/>
        </div>
        
        <!-- Submit -->
        <div class="margin-bottom-sm">
          <button type="submit" class="btn btn--primary btn--md width-100%">Update</button>
        </div>
      </form>
    </div>
  </LayoutDefault>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSiteStore } from '@/domain/base/sites/store/useSiteStore'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import IconAngleLeft from '@/app/components/base/icons/IconAngleLeft.vue'
import AppInput from '@/app/components/base/forms/AppInput.vue'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'

const route = useRoute()
const siteStore = useSiteStore()

onMounted(() => {
    siteStore.show(route.params.site)
})

function update() {
  siteStore.update()
}
</script>
