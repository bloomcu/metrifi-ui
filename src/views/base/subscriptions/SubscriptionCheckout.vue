<template>
  <LayoutDefault>
    <div class="margin-y-md">
      <h1 class="text-lg">Checkout</h1>
    </div>
    
    <!-- Plan -->
    <div class="margin-bottom-md">
      <div v-if="subscriptionStore.plan" class="card card--shadow">
        <PlanCard :plan="subscriptionStore.plan"/>
        <router-link :to="{ name: 'subscription-plans' }" class="btn btn--subtle flex margin-top-sm">Change</router-link>
      </div>

      <div v-else class="card card--dark margin-bottom-sm">
        <div class="card-header">
          <h3 class="text-md margin-bottom-xs">No plan selected</h3>
          <router-link :to="{ name: 'subscription-plans' }">Choose a plan</router-link>
        </div>
      </div>
    </div>
    
    <!-- Payment -->
    <div v-if="subscriptionStore.plan" class="card card--shadow margin-bottom-md">
      <form class="login-form" action="#" @submit.prevent="submit()">
        <div class="margin-bottom-sm">
          <h4>Payment</h4>
        </div>
        
        <AppInput v-model="inputs.payment_name" label="Name on card" required autofocus :errors="errorStore.errors.payment_name" />
        <label class="form-label margin-bottom-xxs" for="card">Card details</label>
        <div id="card" class="form-control margin-bottom-md padding-sm width-100%"></div>
        <button type="submit" class="btn btn--primary btn--md width-100%">Pay</button>
      </form>
    </div>
  </LayoutDefault>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useSubscriptionStore } from '@/domain/base/subscriptions/store/useSubscriptionStore'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import PlanCard from '@/domain/base/subscriptions/components/PlanCard.vue'

const errorStore = useErrorStore()
const subscriptionStore = useSubscriptionStore()

// Setup form inputs
const inputs = ref({
  payment_name: '',
})

// Setup Stripe element
const stripeId = import.meta.env.VITE_STRIPE_KEY
const stripe = Stripe(stripeId)
const elements = stripe.elements()
const cardElement = elements.create('card')

async function submit() {
  console.log('Submiting...', inputs.value.payment_name)
  
  const { setupIntent, error } = await stripe.confirmCardSetup(subscriptionStore.intent, {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: inputs.value.payment_name,
        // email: 'ryan@bloomcu.com',
        // organization: 'BloomCU',
      }
    }
  })
  
  if (error) {
    console.log('Stripe error: ', error)
  } else {
    subscriptionStore.subscribe(setupIntent.payment_method)
  }
}

onMounted(() => {
  if (subscriptionStore.plan) {
    cardElement.mount('#card')
    subscriptionStore.getIntent()
  }
})
</script>
