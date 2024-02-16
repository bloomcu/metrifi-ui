<template>
  <LayoutWithSidebar v-if="dashboard">
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">{{ dashboard.name }}</h1>

      <div class="flex items-center gap-3">
        <!-- Datepicker -->
        <DatePicker />

        <!-- Zoom -->
        <Zoom v-model="dashboard.zoom" @update:modelValue=""/>
      </div>
    </template>

    <div>
      <div v-for="(funnel, index) in dashboard.funnels" class="mb-6 px-10 pt-6 pb-5 border border-gray-300 rounded-xl shadow-lg bg-white">
        <div class="flex items-center justify-between mb-6">
          <p class="text-xl font-medium leading-6 text-gray-900 tracking-tight">{{ funnel.name }}</p>
          <p>Organization: {{ funnel.organization.title }}</p>
        </div>

        <div class="flex gap-6">
          <div class="flex-1">
            <Chart :steps="funnel.steps" :zoom="funnel.zoom" />
          </div>

          <!-- Overall -->
          <div class="w-[14rem]">
            <div class="flex flex-col gap-1 text-center rounded-md bg-white border shadow p-4">
              <p>Overall</p>
              <span class="text-3xl font-medium">{{ funnel.overall_conversion_rate }}%</span>
              <p>conversion rate</p>
            </div>

            <!-- <AppButton @click="duplicateFunnel(funnel)" variant="tertiary" class="mt-2 mr-2 text-xs">Duplicate</AppButton> -->
            <AppButton @click="removeFunnel(index)" variant="secondary" class="mt-4 mr-2 text-xs">Remove</AppButton>
            <AppButton v-if="funnel.organization.title == 'BloomCU'" @click="router.push({name: 'funnel', params: {funnel: 1}})" variant="secondary" class="mt-2 text-xs">Edit</AppButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Add a funnel -->
    <div @click="toggleModal()" class="text-center border border-indigo-400 border-dashed rounded-2xl py-12 px-2 cursor-pointer hover:bg-indigo-50">
      <h2 class="mt-2 text-lg font-medium text-indigo-600">Add a funnel</h2>
    </div>

    <AddFunnelModal :open="isModalOpen" @done="addFunnel()"/>
  </LayoutWithSidebar>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import AddFunnelModal from '@/views/dashboard/modals/AddFunnelModal.vue'
import DatePicker from '@/app/components/datepicker/DatePicker.vue'
import Zoom from '@/views/funnels/components/zoom/Zoom.vue'
import Chart from '@/views/funnels/components/chart/Chart.vue'

const router = useRouter()
const route = useRoute()
const { selectedDateRange } = useDatePicker()

const dashboard = ref()
const loading = ref(true)
const isModalOpen = ref(false)

provide('isModalOpen', isModalOpen)

function addFunnel() {
  let id = Math.floor(100000 + Math.random() * 900000)
  dashboard.value.funnels.push({"winning":false,"overall_conversion_rate":"1.41","organization":{"title":"MetriFi"},"id":id,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"connection_id":2,"connection":{"id":2,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"service":"Google Analytics - Property","account_name":"LBSFCU - BloomCU","name":"www.lbsfcu.org - GA4","uid":"properties/358311950","created_at":"2024-01-25T23:54:47.000000Z","updated_at":"2024-02-15T21:27:46.000000Z"},"name":"Checking accounts funnel","description":"This is the funnel descriptions","automating":null,"automation_msg":null,"zoom":50,"steps":[{"id":1443,"order":1,"metric":null,"name":"/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/"}],"total":"0"},{"id":1444,"order":2,"metric":null,"name":"/accounts/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/accounts/"}],"total":"0"},{"id":1445,"order":3,"metric":null,"name":"/accounts/checking/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/accounts/checking/"}],"total":"0"},{"id":1446,"order":4,"metric":null,"name":"/accounts/checking/checking-account/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/accounts/checking/checking-account/"}],"total":"0"}],"messages":[{"id":146,"funnel_id":578,"type":"info","title":"4 outbound link(s) found for the final step of the funnel.","content":null,"json":{"links":["https://app.loanspq.com/apply.aspx?enc=Kw21Wblm1yxpjJabdoZaD1xi9Nwjs-PrMYcqUlYsJ9P8K02H888Y_xGupLlHU","https://lbsfcu.financialhost.org/registration","https://lbsfcu.financialhost.org/Retrieval/UserName/Consumer/IdentityEstablishment/False","https://app.loanspq.com/apply.aspx?lenderref=LBSFCU&list=xa1sst"],"pagePath":"/accounts/checking/checking-account/"},"created_at":"2024-02-15T18:01:42.000000Z","updated_at":"2024-02-15T18:01:42.000000Z","deleted_at":null}],"created_at":"2024-02-15T17:53:51.000000Z","updated_at":"2024-02-15T18:05:37.000000Z"})
}

function duplicateFunnel(duplicatedFunnel) {
  let id = Math.floor(100000 + Math.random() * 900000)
  duplicatedFunnel.id = id
  dashboard.value.funnels.push(duplicatedFunnel)
}

function removeFunnel(index) {
  dashboard.value.funnels.splice(index, 1)
}

function toggleModal() { 
  isModalOpen.value = !isModalOpen.value 
}

onMounted(() => {
  dashboard.value = dashboards[route.params.dashboard - 1]
})

const dashboards = [
{
    id: 1,
    connection_id: 1,
    zoom: 50,
    name: 'Dashboard one',
    funnels: [
      {"winning":false,"overall_conversion_rate":"2.14","organization":{"title":"BloomCU"},"id":1,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"connection_id":2,"connection":{"id":2,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"service":"Google Analytics - Property","account_name":"LBSFCU - BloomCU","name":"www.lbsfcu.org - GA4","uid":"properties/358311950","created_at":"2024-01-25T23:54:47.000000Z","updated_at":"2024-02-15T21:27:46.000000Z"},"name":"New funnel","description":"This is the funnel descriptions","automating":null,"automation_msg":null,"zoom":50,"steps":[{"id":1443,"order":1,"metric":null,"name":"/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/"}],"total":"0"},{"id":1444,"order":2,"metric":null,"name":"/accounts/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/accounts/"}],"total":"0"},{"id":1445,"order":3,"metric":null,"name":"/accounts/checking/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/accounts/checking/"}],"total":"0"},{"id":1446,"order":4,"metric":null,"name":"/accounts/checking/checking-account/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/accounts/checking/checking-account/"}],"total":"0"}],"messages":[{"id":146,"funnel_id":578,"type":"info","title":"4 outbound link(s) found for the final step of the funnel.","content":null,"json":{"links":["https://app.loanspq.com/apply.aspx?enc=Kw21Wblm1yxpjJabdoZaD1xi9Nwjs-PrMYcqUlYsJ9P8K02H888Y_xGupLlHU","https://lbsfcu.financialhost.org/registration","https://lbsfcu.financialhost.org/Retrieval/UserName/Consumer/IdentityEstablishment/False","https://app.loanspq.com/apply.aspx?lenderref=LBSFCU&list=xa1sst"],"pagePath":"/accounts/checking/checking-account/"},"created_at":"2024-02-15T18:01:42.000000Z","updated_at":"2024-02-15T18:01:42.000000Z","deleted_at":null}],"created_at":"2024-02-15T17:53:51.000000Z","updated_at":"2024-02-15T18:05:37.000000Z"},
    ]
  },
  {
    id: 2,
    connection_id: 1,
    zoom: 50,
    name: 'Dashboard two',
    funnels: [
      {"winning":true,"overall_conversion_rate":"9.23","organization":{"title":"BloomCU"},"id":3,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"connection_id":10,"connection":{"id":10,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"service":"Google Analytics - Property","account_name":"Rivertown - BloomCU","name":"rivertowncu.org - GA4","uid":"properties/360137235","created_at":"2024-02-14T01:58:44.000000Z","updated_at":"2024-02-15T20:13:16.000000Z"},"name":"/contact/","description":null,"automating":null,"automation_msg":null,"zoom":150,"steps":[{"id":1451,"order":1,"metric":null,"name":"/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/"}],"total":"0"},{"id":1452,"order":2,"metric":null,"name":"/contact/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/contact/"}],"total":"0"}],"messages":[],"created_at":"2024-02-15T18:06:18.000000Z","updated_at":"2024-02-15T20:13:35.000000Z"},
      {"winning":false,"overall_conversion_rate":"6.41","organization":{"title":"MetriFi"},"id":4,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"connection_id":10,"connection":{"id":10,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"service":"Google Analytics - Property","account_name":"Rivertown - BloomCU","name":"rivertowncu.org - GA4","uid":"properties/360137235","created_at":"2024-02-14T01:58:44.000000Z","updated_at":"2024-02-15T20:13:16.000000Z"},"name":"/contact/","description":null,"automating":null,"automation_msg":null,"zoom":150,"steps":[{"id":1451,"order":1,"metric":null,"name":"/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/"}],"total":"0"},{"id":1452,"order":2,"metric":null,"name":"/contact/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/contact/"}],"total":"0"}],"messages":[],"created_at":"2024-02-15T18:06:18.000000Z","updated_at":"2024-02-15T20:13:35.000000Z"},
    ]
  },
  {
    id: 3,
    connection_id: 1,
    zoom: 50,
    name: 'Dashboard three',
    funnels: [
      {"winning":false,"overall_conversion_rate":"12.99","organization":{"title":"BloomCU"},"id":5,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"connection_id":2,"connection":{"id":2,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"service":"Google Analytics - Property","account_name":"LBSFCU - BloomCU","name":"www.lbsfcu.org - GA4","uid":"properties/358311950","created_at":"2024-01-25T23:54:47.000000Z","updated_at":"2024-02-15T21:27:46.000000Z"},"name":"/about-us/newsletters-and-pr/","description":null,"automating":null,"automation_msg":null,"zoom":0,"steps":[{"id":1435,"order":1,"metric":null,"name":"/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/"}],"total":"0"},{"id":1436,"order":2,"metric":null,"name":"/about-us/newsletters-and-pr/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/about-us/newsletters-and-pr/"}],"total":"0"}],"messages":[{"id":144,"funnel_id":576,"type":"info","title":"2 outbound link(s) found for the final step of the funnel.","content":null,"json":{"links":["https://www.lbsfcu.org/wp-content/uploads/2024/01/LBS-Newsletter-Jan-2024-WEB-A.pdf","https://www.lbsfcu.org/wp-content/uploads/2023/10/LBS-Newsletter-Oct-2023-WEB-A.pdf"],"pagePath":"/about-us/newsletters-and-pr/"},"created_at":"2024-02-15T17:48:22.000000Z","updated_at":"2024-02-15T17:48:22.000000Z","deleted_at":null}],"created_at":"2024-02-15T17:48:21.000000Z","updated_at":"2024-02-15T17:48:21.000000Z"},
      {"winning":true,"overall_conversion_rate":"23.01","organization":{"title":"MetriFi"},"id":6,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"connection_id":2,"connection":{"id":2,"user":{"id":1,"name":"Ryan Harmon","email":"john@doe.com","role":"admin","created_at":"2024-01-23T23:47:12.000000Z"},"service":"Google Analytics - Property","account_name":"LBSFCU - BloomCU","name":"www.lbsfcu.org - GA4","uid":"properties/358311950","created_at":"2024-01-25T23:54:47.000000Z","updated_at":"2024-02-15T21:27:46.000000Z"},"name":"/about-us/newsletters-and-pr/","description":null,"automating":null,"automation_msg":null,"zoom":0,"steps":[{"id":1435,"order":1,"metric":null,"name":"/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/"}],"total":"0"},{"id":1436,"order":2,"metric":null,"name":"/about-us/newsletters-and-pr/","description":null,"measurables":[{"connection_id":null,"metric":"pageViews","measurable":"/about-us/newsletters-and-pr/"}],"total":"0"}],"messages":[{"id":144,"funnel_id":576,"type":"info","title":"2 outbound link(s) found for the final step of the funnel.","content":null,"json":{"links":["https://www.lbsfcu.org/wp-content/uploads/2024/01/LBS-Newsletter-Jan-2024-WEB-A.pdf","https://www.lbsfcu.org/wp-content/uploads/2023/10/LBS-Newsletter-Oct-2023-WEB-A.pdf"],"pagePath":"/about-us/newsletters-and-pr/"},"created_at":"2024-02-15T17:48:22.000000Z","updated_at":"2024-02-15T17:48:22.000000Z","deleted_at":null}],"created_at":"2024-02-15T17:48:21.000000Z","updated_at":"2024-02-15T17:48:21.000000Z"},
    ]
  },
  {
    id: 4,
    connection_id: 1,
    zoom: 50,
    name: 'New dashboard',
    funnels: []
  },
]
</script>
