<template>
  <router-view/>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOrganizations } from '@/domain/organizations/composables/useOrganizations'

const { showOrganization } = useOrganizations()

onMounted(() => {
  console.log('Mounting organization')
  showOrganization()  
})
</script>

<style lang="scss">
@import '@/app/styles/styles.scss';
</style>
