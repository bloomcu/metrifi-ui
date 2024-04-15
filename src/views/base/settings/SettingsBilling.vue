<template>
  <div class="max-w-2xl divide-y divide-gray-200">
    <!-- Subscription -->
    <div class="pb-12">
      <div class="flex justify-between mb-6">
        <div>
          <p class="text-gray-900 font-medium mb-2">Subscription</p>
          <p class="text-sm text-gray-500">Your organizations current subscription.</p>
        </div>
      </div>

      <AppCard v-if="organizationStore.organization">
        <div class="flex justify-between">
          <p class="text-gray-900">{{ organizationStore.organization.plan.title }}</p>
          <!-- <AppButton :to="{ name: 'subscription-swap' }">Change plan</AppButton> -->
        </div>
        <p class="text-sm text-gray-500">
          {{ organizationStore.organization.plan.price }}{{ organizationStore.organization.plan.interval ? ' / ' + organizationStore.organization.plan.interval : '/month' }}
        </p>
        <p v-if="organizationStore.organization.ends_at" class="text-sm text-indigo-600">
          Your subscription ends {{ moment(organizationStore.organization.ends_at).fromNow() }} 
          on {{ moment(organizationStore.organization.ends_at).format('LL') }}
        </p>
      </AppCard>
    </div>

    <!-- Billing -->
    <!-- <div class="py-12">
      <div class="flex justify-between mb-6">
        <div>
          <p class="text-gray-900 font-medium mb-2">Billing</p>
          <p class="text-sm text-gray-500">Your organizations subscription billing method.</p>
        </div>
        <div>
          <AppButton :to="{}" variant="tertiary">Edit billing info</AppButton>
        </div>
      </div>

      <dl class="divide-y divide-gray-200">
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm leading-6 text-gray-900">Email</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">ryan@bloomcu.com</dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm leading-6 text-gray-900">Address</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">
            <ul>
            <li>1048 S Pueblo St</li>
            <li>Salt Lake City, Utah 84101</li>
            <li>United States</li>
          </ul>
          </dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm leading-6 text-gray-900">EIN tax number</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">No tax information</dd>
        </div>
      </dl>
    </div> -->

    <!-- Payments -->
    <!-- <div class="py-12">
      <div class="flex justify-between mb-6">
        <div>
          <p class="text-gray-900 font-medium mb-2">Payments</p>
          <p class="text-sm text-gray-500">Your organizations payment history.</p>
        </div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-0">Date</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-medium text-gray-900">Amount</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
              <span class="sr-only">Invoice</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(payment, index) in payments" :key="index">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">{{ payment.date }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ payment.amount }}</td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <a href="#" class="text-indigo-600 hover:text-indigo-900">Download invoice</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->

    <!-- <AddressFieldGroup 
      v-model:address1="address.address1"
      v-model:address2="address.address2"
      v-model:city="address.city"
      v-model:state="address.state"
      v-model:postal_code="address.postal_code"
      v-model:country="address.country"
      v-model:lat="address.lat"
      v-model:lng="address.lng"
    /> -->
  </div>
</template>

<script setup>
import moment from "moment"
import { ref } from 'vue'
import { useOrganizationStore } from '@/domain/base/organizations/store/useOrganizationStore'
import AddressFieldGroup from '@/app/components/base/forms/AddressFieldGroup.vue'

const organizationStore = useOrganizationStore()

const payments = [
  { date: 'November 27, 2022', amount: '$64.00' },
  { date: 'October 27, 2022', amount: '$64.00' },
]

const address = ref({
  address1: '',
  address2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  lat: '',
  lng: '',
})
</script>
