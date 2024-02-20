<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Dashboards</h1>

      <!-- <div v-if="connections && connections.length" class="flex items-center gap-2">
        <ConnectionPicker :connections="connections" :selected="selectedConnection" @selected="selectedConnection = $event" class="w-72"/>
        <DatePicker />
        <AppButton variant="tertiary" size="base" @click="downloadCSV()" class="inline-flex items-center">
          <DocumentArrowDownIcon class="mr-1.5 h-5 w-5"/>
          Export
        </AppButton>
      </div> -->
    </template>

    <!-- Grid -->
    <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6">
        <div 
          v-for="dashboard in dashboards" 
          @click="router.push({name: 'dashboard', params: {dashboard: dashboard.id}})" 
          class="group relative flex flex-col cursor-pointer overflow-hidden rounded-lg shadow-md border border-gray-300 bg-white hover:shadow-lg"
        >
          <!-- <div class="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-38"> -->
            <!-- <img :src="product.imageSrc" :alt="product.imageAlt" class="h-full w-full object-cover object-center sm:h-full sm:w-full" /> -->
          <!-- </div> -->
          <div class="flex flex-col h-full divide-y space-y-6 px-4 pt-4">
            <div class="flex-grow ">
              <h3 class="text-xl font-medium text-gray-900">{{ dashboard.name }}</h3>
            </div>

            <div class="flex flex-col divide-y">
              <div v-for="funnel in dashboard.funnels" class="flex items-center justify-between justify-self-end py-3">
                <!-- <div> -->
                  <div class="flex flex-row items-center">
                    <ChartBarIcon class="w-4 mr-1 text-indigo-600"/>
                    <p>{{ funnel.name }}</p>
                  </div>
                  <!-- <p class="text-sm text-gray-500">The Organization</p> -->
                <!-- </div> -->

                <div class="flex items-center gap-2 divide-x">
                  <p class="text-sm text-gray-500">{{ funnel.organization.title }}</p>

                  <div class="flex items-center gap-1 pl-2">
                    <p :class="funnel.winning ? 'text-emerald-400' : 'text-gray-500'" class="text-base font-medium">{{ funnel.overall_conversion_rate }}%</p>
                    <p class="text-sm text-gray-500">CR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add dashboard -->
        <div @click="router.push({name: 'dashboard', params: {dashboard: 4}})" class="flex items-center justify-center border border-indigo-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-indigo-50">
          <h2 class="text-lg font-medium text-indigo-600">Add a dashboard</h2>
        </div>
      </div>

      <!-- Empty state: No report rows -->
      <div v-if="!loading && !report.rows" class="text-center bg-slate-50 rounded-2xl py-12 px-2">
        <NoSymbolIcon class="mx-auto w-8 text-gray-400"/>
        <h2 class="mt-2 text-lg font-medium text-gray-900">No results</h2>
        <p class="mt-1 text-gray-500">Try extending the date range</p>
      </div>

    <!-- State: Loading -->
    <div v-if="false" class="animate-pulse space-y-4">
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>

    <!-- Empty state: No connections -->
    <!-- <div v-if="connections && !connections.length" class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <CloudIcon class="mx-auto w-8 text-indigo-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-gray-900">No connections</h2>
      <p class="mt-1 mb-5 text-gray-500">A connection is needed to explore analytics.</p>
      <AppButton :to="{name: 'connections'}">Go to Connections</AppButton>
    </div> -->
  </LayoutWithSidebar>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NoSymbolIcon } from '@heroicons/vue/24/outline'
import { ChartBarIcon } from '@heroicons/vue/24/solid'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import Chart from '@/views/funnels/components/chart/Chart.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)

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
]
</script>
