<template>
    <LayoutDefault>
        <div class="flex flex-row gap-12">
            <aside class="basis-64 pr-6 border-r">
                <AppCard padding="sm" class="w-60">            
                    <AppNestedMenu 
                        title="Category"
                        :show-title="true"
                        :options="categories"
                        :active="query.category"
                        @selected="setCategory"
                    />
                </AppCard>
            </aside>

            <main class="flex-1">
                <table class="min-w-full table-fixed divide-y divide-gray-300">
                    <thead>
                    <tr>
                        <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                        <input type="checkbox" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600" />
                        </th>
                        <th scope="col" class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">Title & URL</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3">
                        <span class="sr-only">Edit</span>
                        </th>
                    </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="page in pages" :key="page.id">
                            <!-- Checkbox -->
                            <td class="relative px-7 sm:w-12 sm:px-6">
                            <input type="checkbox" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600" :value="page.id" />
                            </td>

                            <!-- Title & Url -->
                            <td class="whitespace-nowrap py-4 pr-3 text-sm">
                            <div class="font-medium text-gray-900">{{ page.title }}</div>
                            <div class="mt-1 truncate text-gray-500">{{ page.url }}</div>
                            </td>

                            <!-- Type -->
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <AppListbox v-model="page.type" :options="pageTypes" @update:modelValue="loggit"/>
                            </td>

                            <!-- Status -->
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <AppListbox v-model="page.junk_status" :options="pageJunkStatuses" @update:modelValue="loggit">
                                    <template v-slot:before>
                                        <div :class="junkStatusClasses[page.junk_status.slug]" class="flex-none rounded-full p-1"><div class="h-1.5 w-1.5 rounded-full bg-current"></div></div>
                                    </template>
                                </AppListbox>
                            </td>

                            <!-- Edit -->
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                            <a href="#" class="text-violet-600 hover:text-violet-700">Edit</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </main>
        </div>

        <!-- Basic teleport demo -->
        <Teleport v-if="teleporting" :to="teleportTarget" :disabled="false">
            <div class="absolute left-full top-0 translate-x-2 w-96 border bg-white shadow z-50 sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                <h3 class="text-base font-semibold leading-6 text-gray-900">The modal</h3>
                <div class="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Lorem ipsum dolor.</p>
                </div>
                </div>
            </div>
        </Teleport>

        <div>
            <div class="mb-4 relative inline-block">
                <button @click="teleport('#target1')" class="items-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white">Button One</button>
                <div id="target1"></div>
            </div>
        </div>
        <div>
            <div class="mb-4 relative inline-block">
                <button @click="teleport('#target2')" class="items-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white">Button Two</button>
                <div id="target2"></div>
            </div>
        </div>
        <div>
            <div class="mb-4 relative inline-block">
                <button @click="teleport('#target3')" class="items-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white">Button Three</button>
                <div id="target3"></div>
            </div>
        </div>

    </LayoutDefault>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useQuery from '@/app/composables/base/useQuery.js'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import AppNestedMenu from '@/app/components/base/nested-menu/AppNestedMenu.vue'
import AppListbox from '@/app/components/base/forms/AppListbox.vue'
// import MetricWizard from '@/views/funnels/components/metrics/MetricWizard.vue'

const teleporting = ref(false)
const teleportTarget = ref(null)

const teleport = (target) => {
    if (teleportTarget.value === target) {
        teleporting.value = false
        teleportTarget.value = null
        return
    }

    teleporting.value = true
    teleportTarget.value = target
}

// const mounted = ref(false)

onMounted(() => {
    // mounted.value = true;
});

function loggit(msg) {
    console.log('loggit', msg)
}

const {query, set} = useQuery()

const categories = [
    {title: 'Parent A', slug: 'parent-a'},
    {title: 'Parent B', slug: 'parent-b', children: [
        {title: 'Child 1', slug: 'child-1'},
        {title: 'Child 2', slug: 'child-2', children: [
            {title: 'Grandchild 1', slug: 'grandchild-1'},
            {title: 'Grandchild 2', slug: 'grandchild-2'},
        ]},
    ]},
]

const pages = ref([
    {"id":280,"parent_id":null,"http_status":null,"title":"Mountain America Credit Union in Utah & the West","url":"https://www.macu.com/","wordcount":444,"category":null,"status":{"title":"Needs Review","slug":"needs-review"},"order":1,"type":{"title":"Product","slug":"product"},"junk_status":{"title":"Keep","slug":"keep"},"created_at":"2023-11-17T20:18:08.000000Z","deleted_at":null},
    {"id":281,"parent_id":null,"http_status":null,"title":"Open Checking and Saving Accounts with Ease | MACU","url":"https://www.macu.com/accounts","wordcount":316,"category":null,"status":{"title":"Needs Review","slug":"needs-review"},"order":2,"type":{"title":"Service","slug":"service"},"junk_status":{"title":"Keep","slug":"keep"},"created_at":"2023-11-17T20:18:08.000000Z","deleted_at":null},
    {"id":282,"parent_id":null,"http_status":null,"title":"Rewards Checking Account - MyStyle Checking | MACU","url":"https://www.macu.com/accounts/checking/mystyle-checking","wordcount":1625,"category":null,"status":{"title":"Needs Review","slug":"needs-review"},"order":3,"type":{"title":"Info","slug":"info"},"junk_status":{"title":"Keep","slug":"keep"},"created_at":"2023-11-17T20:18:08.000000Z","deleted_at":null}
])

const pageTypes = [
  {title: 'Product', slug: 'product'},
  {title: 'Service', slug: 'service'},
  {title: 'Info', slug: 'info'},
]

const pageJunkStatuses = [
  {title: 'Keep', slug: 'keep'},
  {title: 'Trash', slug: 'trash'},
]

const junkStatusClasses = {
  keep: 'text-green-400 bg-green-400/10',
  trash: 'text-red-400 bg-red-400/10',
}

function setCategory(slug) {
    set('category', slug)
}
</script>
