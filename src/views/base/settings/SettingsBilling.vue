<template>
  <!-- Processing successful subscription -->
  <div v-if="showLoader" class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center z-50 space-y-4">
    <div class="w-16 h-16 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
    <p class="text-white text-xl">Processing subscription</p>
  </div>

  <!-- Billing portal -->
  <AppCard v-if="organizationSubscriptionStore.subscription && !organizationSubscriptionStore.subscription.plan.title.startsWith('Free')" class="mb-12">
    <h2 class="text-base font-medium leading-6 text-gray-900">Billing portal</h2>
    <p class="mt-2 text-sm text-gray-500">Manage your payment information and invoices.</p>
    <AppButton @click="visitBillingPortal()" variant="secondary" class="mt-6">Visit billing portal</AppButton>
  </AppCard>

  <!-- Plans -->
  <AppCard v-if="organizationSubscriptionStore.subscription"  class="mb-12">
    <h2 class="text-base font-medium leading-6 text-gray-900">Plans</h2>
    <p class="mt-2 text-sm text-gray-500">You are currently subscribed to <span class="font-medium text-gray-800">{{ organizationSubscriptionStore.subscription.plan.title }}</span>.</p>

    <!-- Frequency toggle -->
    <fieldset class="mt-8" aria-label="Payment frequency">
      <RadioGroup v-model="frequency" class="w-fit grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-sm font-semibold ring-1 ring-inset ring-gray-200">
        <RadioGroupOption as="template" v-for="option in frequencies" :key="option.value" :value="option" v-slot="{ checked }">
          <div :class="[checked ? 'bg-violet-600 text-white' : 'text-gray-500', 'cursor-pointer rounded-full px-6 py-2']">
            {{ option.label }}
            <span v-if="option.value === 'yearly'" class="text-xs font-medium text-violet-600 py-0.5 px-2 ml-0.5 rounded-full bg-violet-100">Save 17%</span>
          </div>
        </RadioGroupOption>
      </RadioGroup>
    </fieldset>
    
    <!-- Plans -->
    <div class="isolate mt-6 grid grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      <div v-for="(tier, index) in plans[frequency.value]" :key="index" :class="[organizationSubscriptionStore.subscription.plan.title == tier.title ? 'ring-2 ring-violet-600' : 'ring-1 ring-gray-200', 'rounded-3xl p-4 xl:p-6']">
        <div class="flex items-center justify-between gap-x-4">
          <h3 class="text-gray-900 text-lg font-semibold">{{ tier.title }}</h3>
          <p v-if="organizationSubscriptionStore.subscription.plan.title == tier.title" class="rounded-full bg-violet-600/10 px-2.5 py-1 text-xs/5 font-semibold text-violet-600">Current plan</p>
        </div>

        <p class="mt-6 flex items-baseline gap-x-1">
          <span class="text-3xl font-semibold tracking-tight text-gray-900">{{ tier.price }}</span>
          <span class="text-sm/6 font-semibold text-gray-600">{{ tier.priceSuffix }}</span>
        </p>

        <ul role="list" class="mt-6 space-y-3 text-sm/6 text-gray-600">
          <li v-for="feature in tier.features" :key="feature" class="flex gap-x-2">
            <CheckIcon class="h-6 w-5 flex-none text-violet-600" aria-hidden="true" />
            {{ feature }}
          </li>
        </ul>

        <button v-if="tier.group == 'free' && organizationSubscriptionStore.subscription.plan.title !== 'Free Plan'" @click="cancelPlan()" class="w-full text-violet-600 ring-1 ring-inset ring-violet-200 hover:ring-violet-300 mt-8 block rounded-full px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
          Downgrade to {{ tier.title }}
        </button>
        <button v-if="tier.group == 'starter' && organizationSubscriptionStore.subscription.plan.title !== tier.title" @click="selectPlan(tier.price_id)" class="w-full bg-violet-600 text-white shadow-sm hover:bg-violet-500 mt-8 block rounded-full px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
          Upgrade to {{ tier.title }}
        </button>
        <a v-if="tier.href" :href="tier.href" target="_blank" class="w-full bg-violet-600 text-white shadow-sm hover:bg-violet-500 mt-8 block rounded-full px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
          Upgrade to {{ tier.title }}
        </a>

        <p v-if="tier.title === 'Starter Yearly'" :class="invisible" class="text-center text-sm/6 text-violet-600 mt-2">Subscribe annually and get 2 months free</p>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import { useRoute, useRouter } from 'vue-router'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { useOrganizationSubscriptionStore } from '@/domain/organizations/store/useOrganizationSubscriptionStore'
import { stripeApi } from '@/domain/stripe/api/stripeApi'

const route = useRoute()
const router = useRouter()
const organizationStore = useOrganizationStore()
const organizationSubscriptionStore = useOrganizationSubscriptionStore()

const showLoader = computed(() => route.query.success === 'true')

const frequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

const frequency = ref(frequencies[0])

const plans = {
  monthly: [
    {
      title: 'Free Plan',
      group: 'free',
      href: null,
      price: '$0',
      priceSuffix: '',
      price_id: '',
      features: [
        'Recommendations: 2 / mo', 
        'Funnels: unlimited', 
        'Comparisons: unlimited', 
        'Users: unlimited',
        'File retention: 1 year'
      ],
    },
    {
      title: 'Starter Monthly',
      group: 'starter',
      frequency: 'monthly',
      href: null,
      price: '$99',
      priceSuffix: '/ month',
      price_id: 'price_1QF8fLRB5mhzFf19UAWKZhkx', // Staging
      // price_id: 'price_1QDAmYIoK0qLKtdjC0Z8TKYl', // Local
      features: [
        'Recommendations: 10 / mo', 
        'Funnels: unlimited', 
        'Comparisons: unlimited', 
        'Users: unlimited',
        'File retention: 1 year'
      ],
    },
    {
      title: 'Growth',
      group: 'growth',
      frequency: 'monthly',
      href: 'https://metrifi.com/pricing/growth-plan/',
      price: 'Contact us',
      priceSuffix: '',
      price_id: '',
      features: [
        'Recommendations: custom', 
        'Funnels: unlimited', 
        'Comparisons: unlimited', 
        'Users: unlimited',
        'File retention: 1 year'
      ],
    },
  ],
  
  yearly: [
    {
      title: 'Free Plan',
      group: 'free',
      href: null,
      price: '$0',
      priceSuffix: '',
      price_id: '',
      features: [
        'Recommendations: 2 / mo', 
        'Funnels: unlimited', 
        'Comparisons: unlimited', 
        'Users: unlimited',
        'File retention: 1 year'
      ],
    },
    {
      title: 'Starter Yearly',
      group: 'starter',
      href: null,
      price: '$990',
      priceSuffix: '/ year',
      price_id: 'price_1QFi54RB5mhzFf19jxiFvBQG', // Staging
      // price_id: 'price_1QFiAtIoK0qLKtdjZHFs4KwO', // Local
      features: [
        'Recommendations: 10 / mo', 
        'Funnels: unlimited', 
        'Comparisons: unlimited', 
        'Users: unlimited',
        'File retention: 1 year'
      ],
    },
    {
      title: 'Growth',
      group: 'growth',
      href: 'https://metrifi.com/pricing/growth-plan/',
      price: 'Contact us',
      priceSuffix: '',
      price_id: '',
      features: [
        'Recommendations: custom', 
        'Funnels: unlimited', 
        'Comparisons: unlimited', 
        'Users: unlimited',
        'File retention: 1 year'
      ],
    },
  ]
}

const visitBillingPortal = () => {
  stripeApi.billing(route.params.organization)
    .then(response => {
      window.location.assign(response.data.redirect_url)
    }).catch(error => {
      console.log('Error', error.response.data)
    })
}

const selectPlan = (price_id) => {
  stripeApi.checkout(route.params.organization, {
    price_id: price_id
  })
    .then(response => {
      window.location.assign(response.data.redirect_url)
    }).catch(error => {
      console.log('Error', error.response.data)
    })
}

const cancelPlan = () => {
  stripeApi.cancel(route.params.organization)
    .then(response => {
      location.reload()
    }).catch(error => {
      console.log('Error', error.response.data)
    })
}

onMounted(() => {
  // Check if the loader should be shown
  if (showLoader.value) {
    setTimeout(() => {
      // Remove `success` from the query parameters
      router.replace({ query: { ...route.query, success: undefined } }).then(() => {
        // Refresh the page after updating the URL
        location.reload()
      })
    }, 4000) // Wait for 4 seconds
  }
})
</script>
