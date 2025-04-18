<template>
  <!-- Processing successful subscription -->
  <div v-if="showLoader" class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center z-50 space-y-4">
    <div class="w-16 h-16 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
    <p class="text-white text-xl">Processing subscription</p>
  </div>

  <!-- Plans -->
  <div v-if="organizationSubscriptionStore.subscription"  class="mb-12">
    <h2 class="text-base font-medium leading-6 text-gray-900">Plans</h2>

    <!-- Plan has upcoming changes -->
    <div v-if="organizationSubscriptionStore.subscription.upcoming_plan" class="rounded-md bg-yellow-50 mt-2 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Your subscription to <span class="font-bold">{{ organizationSubscriptionStore.subscription.plan.title }}</span> 
            will change to <span class="font-bold">{{ organizationSubscriptionStore.subscription.upcoming_plan }}</span> 
            on {{ moment(organizationSubscriptionStore.subscription.upcoming_plan_start_at).format('MMM DD, YYYY') }}.
          </p>
        </div>
      </div>
    </div>

    <!-- Plan is canceling message -->
    <div v-else-if="organizationSubscriptionStore.subscription.ends_at" class="rounded-md bg-yellow-50 mt-2 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Your subscription to <span class="font-bold">{{ organizationSubscriptionStore.subscription.plan.title }}</span> will end on {{ moment(organizationSubscriptionStore.subscription.ends_at).format('MMM DD, YYYY') }}.
            {{ ' ' }}
            <button @click="visitBillingPortal()" class="text-yellow-700 underline hover:text-yellow-600">Renew subscription</button>
          </p>
        </div>
      </div>
    </div>

    <!-- Plan is active -->
    <p v-else class="mt-2 text-sm text-gray-500">You are currently subscribed to <span class="font-bold text-violet-700">{{ organizationSubscriptionStore.subscription.plan.title }}</span>.</p>

    <!-- Frequency toggle -->
    <!-- <fieldset class="mt-8" aria-label="Payment frequency">
      <RadioGroup v-model="frequency" class="w-fit grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-sm font-semibold ring-1 ring-inset ring-gray-200">
        <RadioGroupOption as="template" v-for="option in frequencies" :key="option.value" :value="option" v-slot="{ checked }">
          <div :class="[checked ? 'bg-violet-500 text-white' : 'text-gray-500', 'cursor-pointer rounded-full px-6 py-2']">
            {{ option.label }}
            <span v-if="option.value === 'yearly'" class="text-xs font-medium text-violet-500 py-0.5 px-2 ml-0.5 rounded-full bg-violet-100">Save 16%</span>
          </div>
        </RadioGroupOption>
      </RadioGroup>
    </fieldset> -->
    
    <!-- Plans -->
    <div class="isolate mt-6 grid grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-4">
      <div v-for="(tier, index) in plans[frequency.value]" :key="index" :class="[organizationSubscriptionStore.subscription.plan.title == tier.fullTitle ? 'ring-2 ring-violet-600' : 'ring-1 ring-gray-200', 'rounded-3xl p-4 xl:p-6']">
        <div class="flex items-center justify-between gap-x-4">
          <h3 class="text-gray-900 text-lg font-semibold">{{ tier.title }}</h3>
          <p v-if="organizationSubscriptionStore.subscription.plan.title == tier.fullTitle" class="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs/5 font-semibold text-violet-500">Current plan</p>
        </div>

        <p class="mt-4 flex items-baseline gap-x-1">
          <span class="text-3xl font-semibold tracking-tight text-gray-900">{{ tier.price }}</span>
          <span class="text-sm/6 font-semibold text-gray-600">{{ tier.priceSuffix }}</span>
        </p>

        <!-- <p v-if="frequency.value == 'yearly'" class="mt-1.5 text-sm text-gray-600">{{ tier.fullTitle == 'Starter Yearly' ? 'Billed yearly at $996' : '&nbsp;' }} </p> -->

        <ul role="list" class="mt-6 space-y-3 text-sm/6 text-gray-600">
          <li v-for="feature in tier.features" :key="feature" class="flex gap-x-2">
            <CheckIcon v-if="feature.included" class="h-6 w-5 flex-none text-violet-500" aria-hidden="true" />
            <XMarkIcon v-else class="h-6 w-5 flex-none text-gray-400" aria-hidden="true" />
            {{ feature.text }}
          </li>
        </ul>

        <a v-if="['growth', 'starter', 'enterprise'].includes(tier.group)" :href="tier.href" target="_blank" class="w-full bg-violet-500 text-white shadow-sm hover:bg-violet-600 mt-8 block rounded-full px-3 py-2 text-center text-sm/6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
            Upgrade to {{ tier.title }}
        </a>
      </div>
    </div>
  </div>

  <!-- Billing portal -->
  <AppCard v-if="organizationSubscriptionStore.subscription && organizationSubscriptionStore.subscription.subscribed" class="mb-12">
    <h2 class="text-base font-medium leading-6 text-gray-900">Billing portal</h2>
    <p class="mt-2 text-sm text-gray-500">Manage your payment information and invoices.</p>
    <div class="flex gap-3 mt-6">
      <AppButton @click="visitBillingPortal()" variant="secondary">Visit billing portal</AppButton>
      <AppButton @click="updateSubscription()" variant="secondary">Change subscription plan</AppButton>
    </div>
  </AppCard>

  <!-- Cancel -->
  <AppButton v-if="organizationSubscriptionStore.subscription && organizationSubscriptionStore.subscription.subscribed" @click="cancelSubscription()" variant="link">Cancel subscription</AppButton>
</template>

<script setup>
import moment from "moment"
import { ref, computed, onMounted } from 'vue'
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { ExclamationTriangleIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/20/solid'
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
  { value: 'yearly', label: 'Yearly' },
  { value: 'monthly', label: 'Monthly' },
]

const frequency = ref(frequencies[0])

const plans = {
  monthly: [
    {
      title: 'Free',
      fullTitle: 'Free',
      group: 'free',
      href: null,
      price: '$0',
      priceSuffix: '',
      price_id: '',
      features: [
        'Recommendations: 2 per month', 
        'Funnels: unlimited', 
        'Comparisons: unlimited', 
        'File retention: 1 year'
      ],
    },
    {
      title: 'Starter',
      fullTitle: 'Starter Monthly',
      group: 'starter',
      frequency: 'monthly',
      href: null,
      price: '$99',
      priceSuffix: '/ month',
      price_id: 'price_1QHVQdK64893LVlSnjMHeeOk', // Production
      // price_id: 'price_1QF8fLRB5mhzFf19UAWKZhkx', // Staging
      // price_id: 'price_1QG5rLIoK0qLKtdj50iKKLaq', // Local
      features: [
        'Recommendations: 10 / mo', 
        'Funnels: unlimited', 
        'Comparisons: unlimited', 
        'File retention: 1 year'
      ],
    },
    {
      title: 'Growth',
      fullTitle: 'Growth Monthly',
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
        'File retention: 1 year'
      ],
    },
  ],
  
  yearly: [
    {
      title: 'Free',
      fullTitle: 'Free',
      group: 'free',
      href: null,
      price: '$0',
      priceSuffix: '',
      price_id: '',
      features: [
        {
            text: 'Recommendations: 2 / yr', 
            included: true,
        },
        {
            text: 'Design reviews for A/B tests',
            included: false,
        },
        {
            text: 'Funnels: unlimited', 
            included: true,
        },
        {
            text: 'Comparisons: unlimited', 
            included: true,
        },
        {
            text: 'File retention: 1 year',
            included: true,
        },
      ],
    },
    {
      title: 'Starter',
      fullTitle: 'Starter Yearly',
      group: 'starter',
      href: 'https://metrifi.com/upgrade-your-metrifi-plan/',
      price: 'Contact us',
      priceSuffix: '',
      price_id: '',
      // price_id: 'price_1QHVQzK64893LVlSx24PpimR', // Production
      // price_id: 'price_1QHUFJRB5mhzFf19JkljJoNt', // Staging
      // price_id: 'price_1QHTk3IoK0qLKtdjKBrj2CEF', // Local
      features: [
        {
            text: 'Recommendations: 12 / yr', 
            included: true,
        },
        {
            text: 'Design reviews for A/B tests',
            included: false,
        },
        {
            text: 'Funnels: unlimited', 
            included: true,
        },
        {
            text: 'Comparisons: unlimited', 
            included: true,
        },
        {
            text: 'File retention: 1 year',
            included: true,
        },
      ],
    },
    {
      title: 'Growth',
      fullTitle: 'Growth Yearly',
      group: 'growth',
      href: 'https://metrifi.com/upgrade-your-metrifi-plan/',
      price: 'Contact us',
      priceSuffix: '',
      price_id: '',
      features: [
        {
            text: 'Recommendations: 24 / yr', 
            included: true,
        },
        {
            text: 'Design reviews for A/B tests',
            included: false,
        },
        {
            text: 'Funnels: unlimited', 
            included: true,
        },
        {
            text: 'Comparisons: unlimited', 
            included: true,
        },
        {
            text: 'File retention: 1 year',
            included: true,
        },
      ],
    },
    {
      title: 'Enterprise',
      fullTitle: 'Growth Yearly',
      group: 'enterprise',
      href: 'https://metrifi.com/upgrade-your-metrifi-plan/',
      price: 'Contact us',
      priceSuffix: '',
      price_id: '',
      features: [
        {
            text: 'Recommendations: 48 / yr', 
            included: true,
        },
        {
            text: 'Design reviews for A/B tests',
            included: true,
        },
        {
            text: 'Funnels: unlimited', 
            included: true,
        },
        {
            text: 'Comparisons: unlimited', 
            included: true,
        },
        {
            text: 'File retention: 1 year',
            included: true,
        },
      ],
    },
  ]
}

const visitBillingPortal = () => {
  stripeApi.visitBillingPortal(route.params.organization)
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


const updateSubscription = () => {
  stripeApi.update(route.params.organization)
    .then(response => {
      window.location.assign(response.data.redirect_url)
    }).catch(error => {
      console.log('Error', error.response.data)
    })
}

const cancelSubscription = () => {
  stripeApi.cancel(route.params.organization)
    .then(response => {
      window.location.assign(response.data.redirect_url)
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
