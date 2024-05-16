<template>
  <router-view/>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrganizations } from '@/domain/organizations/composables/useOrganizations'

const route = useRoute()
const { showOrganization } = useOrganizations()

onMounted(() => {
  console.log('Mounting organization')
  if (route.params.organization) {
    showOrganization()
  }
})
</script>

<style lang="scss">
@import '@/app/styles/styles.scss';
</style>
