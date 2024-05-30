<template>
  <LayoutDefault>
    <div class="flex items-center justify-between margin-y-md">
      <h1 class="text-lg">Swap plan</h1>
    </div>

    <div v-if="!organizationStore.isLoading && subscriptionStore.planAvailability" class="margin-bottom-md">
      <div v-for="plan in subscriptionStore.plans" :key="plan.id">
        <!-- Can swap -->
        <div v-if="subscriptionStore.planAvailability[plan.slug]" class="card card--shadow margin-bottom-sm flex gap-md items-center justify-between">
          <PlanCard :plan="plan" class="flex-grow"/>
          <button @click="swapPlan(plan.slug)" class="btn btn--primary margin-top-sm">Swap</button>
        </div>
        
        <!-- Cannot swap -->
        <div v-else class="card card--dark margin-bottom-sm flex gap-md items-center justify-between">
          <PlanCard :plan="plan" class="flex-grow"/>
          <div v-if="organizationStore.organization.plan.slug === plan.slug" class="margin-top-sm">
            <span class="text-bold text-uppercase text-xs color-primary border border-primary radius-full padding-x-xxs padding-y-xxxxs">Current plan</span>
          </div>
          <!-- <p class="text-sm margin-top-sm">{{ organizationStore.organization.title }} has too many users.</p> -->
        </div>
      </div>
    </div>
  </LayoutDefault>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { useSubscriptionStore } from '@/domain/base/subscriptions/store/useSubscriptionStore'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import PlanCard from '@/domain/base/subscriptions/components/PlanCard.vue'

const organizationStore = useOrganizationStore()
const subscriptionStore = useSubscriptionStore()

function swapPlan(plan_slug) {
  subscriptionStore.update(plan_slug)
}

onMounted(() => {
  organizationStore.show()
  subscriptionStore.indexPlans()
  subscriptionStore.getPlanAvailability()
})
</script>
