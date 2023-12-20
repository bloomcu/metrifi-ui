<template>
  <div>
    <div class="flex justify-between border-bottom">
      <div class="container max-width-xl padding-y-xs">
        <RouterLink :to="{ name: 'sites' }" class="btn btn--subtle btn--sm">Back</RouterLink>
        <!-- <RouterLink :to="{ name: 'sites' }" class="btn btn--primary btn--sm float-right">Edit</RouterLink> -->
      </div>
    </div>
    
    <LayoutDefault maxWidth="xl">
      <div class="flex">
        <main class="position-relative z-index-1 flex-grow height-auto padding-y-md padding-right-md">
          <LaunchHero/>
          <LaunchStep1/>
          <LaunchStep2/>
          <LaunchStep3/>
          <LaunchStep4/>
          <LaunchStep5/>
        </main>
        
        <aside class="position-relative z-index-1 width-100% border-left max-width-xxxs padding-y-md padding-left-md">
          <LaunchSidebar/>
        </aside>
      </div>
    </LayoutDefault>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSiteStore } from '@/domain/base/sites/store/useSiteStore'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import LaunchHero from '@/views/base/sites/components/launch/LaunchHero.vue'
import LaunchStep1 from '@/views/base/sites/components/launch/steps/LaunchStep1.vue'
import LaunchStep2 from '@/views/base/sites/components/launch/steps/LaunchStep2.vue'
import LaunchStep3 from '@/views/base/sites/components/launch/steps/LaunchStep3.vue'
import LaunchStep4 from '@/views/base/sites/components/launch/steps/LaunchStep4.vue'
import LaunchStep5 from '@/views/base/sites/components/launch/steps/LaunchStep5.vue'
import LaunchSidebar from '@/views/base/sites/components/launch/LaunchSidebar.vue'

const route = useRoute()
const siteStore = useSiteStore()

onMounted(() => {
    siteStore.show(route.params.site)
})
</script>
