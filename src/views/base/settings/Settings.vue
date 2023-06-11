<template>
  <LayoutDefault>
    <div class="grid gap-md margin-y-md">
      <div class="col-12">
        <h1 class="text-lg">Settings</h1>
      </div>
      
      <div class="col-4">
        <div class="text-component">
          <h4>Subscription</h4>
          <p>See all your subscription details and manage or cancel your subscription at any time.</p>
        </div>
      </div>
      
      <div class="col-8">
        <div class="card card--shadow">
          <div class="border-bottom margin-bottom-md padding-bottom-md">
            <!-- Plan -->
            <h5 class="text-bold margin-bottom-sm">Your organizations' plan</h5>
            <div v-if="organizationStore.organization" class="card card--shadow">
              <div class="card-header">
                <div class="flex justify-between">
                  <h4 class="text-md color-primary">{{ organizationStore.organization.plan.title }}</h4>
                  <router-link :to="{ name: 'subscription-swap' }" class="btn btn--primary">Change plan</router-link>
                </div>
                <p class="text-sm">
                  {{ organizationStore.organization.plan.price }}
                  {{ organizationStore.organization.plan.interval ? ' / ' + organizationStore.organization.plan.interval : '' }}
                </p>
              </div>
              <div class="card-content grid gap-xs">
                <p class="text-sm">Limits: 1 user, 5 rate groups</p>
                <p v-if="organizationStore.organization.ends_at" class="text-sm color-primary">
                  Your subscription ends {{ moment(organizationStore.organization.ends_at).fromNow() }} 
                  on {{ moment(organizationStore.organization.ends_at).format('LL') }}
                </p>
              </div>
            </div>
          </div>
          
          <div class="grid gap-md border-bottom margin-bottom-md padding-bottom-md">
            <h5 class="text-bold">Billing details</h5>
            <div>
              <p class="text-sm color-contrast-low margin-bottom-xs">Billing email:</p>
              <p>ryan@bloomcu.com</p>
            </div>
            <div>
              <p class="text-sm color-contrast-low margin-bottom-xs">Billing address:</p>
              <p>1048 S Pueblo St <br> Salt Lake City, UT 84104</p>
            </div>
            <div>
              <p class="text-sm color-contrast-low margin-bottom-xs">Tax information:</p>
              <p>No tax information</p>
              <!-- <router-link :to="{name: 'subscription-plans'}" class="btn btn--subtle">Enter tax information</router-link> -->
            </div>
          </div>
          
          <div class="padding-bottom-sm">
            <h5 class="text-bold margin-bottom-sm">
              Payment history
            </h5>
            <table class="int-table position-relative z-index-1 width-100% text-unit-em text-sm">
              <tbody class="int-table__body">
                <tr class="int-table__row">
                  <td class="int-table__cell" role="cell">$64.00</td>
                  <td class="int-table__cell" role="cell">November 27, 2022</td>
                  <td class="int-table__cell text-right" role="cell"><a href="#">Download invoice</a></td>
                </tr>
                <tr class="int-table__row">
                  <td class="int-table__cell" role="cell">$64.00</td>
                  <td class="int-table__cell" role="cell">October 27, 2022</td>
                  <td class="int-table__cell text-right" role="cell"><a href="#">Download invoice</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </LayoutDefault>
</template>

<script setup>
import moment from "moment"
import { onMounted } from 'vue'
import { useOrganizationStore } from '@/domain/base/organizations/store/useOrganizationStore'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
// import UserAvatar from '@/domain/base/users/components/UserAvatar.vue'
// import AppChip from '@/app/components/base/chips/AppChip.vue'
// import ButtonDestroy from '@/app/components/base/buttons/ButtonDestroy.vue'
// import ButtonCopyToClipboard from '@/app/components/base/buttons/ButtonCopyToClipboard.vue'

const organizationStore = useOrganizationStore()

onMounted(() => {
  organizationStore.show()
})
</script>
