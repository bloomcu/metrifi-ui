<template>
  <div>
    <div class="flex justify-between items-center margin-bottom-xs">
      <h4 class="text-md color-primary">{{ plan.title }}</h4>
      <p class="text-medium">
        {{ plan.price }}
        {{ plan.interval ? ' / ' + plan.interval : '' }}
      </p>
    </div>
    <p class="text-sm">Limits: {{ plan.limits.users }} user(s), {{ plan.limits.rates }} rate groups</p>
  </div>
</template>

<script setup>
const props = defineProps({
  plan: { 
    type: Object,
  }
})
</script>
