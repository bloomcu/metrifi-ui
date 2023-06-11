<template>
  <LayoutDefault>
    <div class="flex items-center justify-between margin-y-md">
      <h1 class="text-lg">Subscription plans</h1>
    </div>

    <div class="margin-bottom-md">
      <router-link
        v-for="plan in subscriptionStore.plans" 
        :key="plan.id"
        :to="{name: 'subscription-checkout'}"
        @click="subscriptionStore.plan = plan"
        class="card card--shadow margin-bottom-sm"
      >
        <PlanCard :plan="plan"/>
      </router-link>
    </div>
  </LayoutDefault>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSubscriptionStore } from '@/domain/base/subscriptions/store/useSubscriptionStore'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import PlanCard from '@/domain/base/subscriptions/components/PlanCard.vue'

const subscriptionStore = useSubscriptionStore()

onMounted(() => {
  if (!subscriptionStore.plans) {
    subscriptionStore.indexPlans()
  }
})
</script>
