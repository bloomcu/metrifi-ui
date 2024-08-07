<template>

</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()
const redirect = import.meta.env.VITE_REDIRECT_FROM_LOGIN_ROUTE

onMounted(() => {
  if (authStore.isAdmin) {
    router.push({ name: 'adminDashboards' })
  } else {    
    router.push({ name: redirect, params: { organization: authStore.user.organization.slug }})
  }
})
</script>
