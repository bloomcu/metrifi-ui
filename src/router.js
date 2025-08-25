import { createRouter, createWebHistory } from 'vue-router'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import baseRoutes from '@/routes/base/routes.js'
import admin from '@/views/admin/routes/index.js'
import benchmarks from '@/views/benchmarks/routes/index.js'
import dashboards from '@/views/dashboards/routes/index.js'
import explore from '@/views/explore/routes/index.js'
import funnels from '@/views/funnels/routes/index.js'
import recommendations from '@/views/recommendations/routes/index.js'
import services from '@/views/services/routes/index.js'
import welcome from '@/views/welcome/routes/index.js'
// import onboarding from '@/views/onboarding/routes/index.js'

import Sandbox from '@/views/Sandbox.vue';
// import Flowchart from '@/views/Flowchart.vue';

const routes = [
  ...baseRoutes,
  ...admin,
  ...benchmarks,
  ...dashboards,
  ...explore,
  ...funnels,
  ...recommendations,
  ...services,
  ...welcome,
  // ...onboarding,
  // {
  //   path: '/',
  //   redirect: '/admin/organizations'
  // },
//   { 
//     path: '/sandbox', 
//     component: Sandbox 
//   },
  // { 
  //   path: '/flowchart', 
  //   component: Flowchart
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

/**
* Clear any form validation errors
* When routing to another view, we don't want form validations errors following us
*/
router.beforeEach(async (to) => {
  const { emptyErrors } = useErrorStore()
  emptyErrors()
})

/**
* Hydrate organization
* Perform initial hydration of organization
* When routing, if the organization changes re-hydrate the organization
*/
router.beforeEach(async (to) => {
  const organizationStore = useOrganizationStore()

  if (
    to.params.organization &&
    to.params.organization !== organizationStore.organization?.slug
  ) {
    // console.log('Re-hydrating organization...')
    await organizationStore.show(to.params.organization)
  }
})

/**
* Restrict unauthenticated route access
* Redirect to login route if not logged in and trying to access a restricted route
*/
router.beforeEach(async (to) => {
  // TODO: Can I just instantiate this store one in this file?
  const { user } = useAuthStore()
  
  const publicRouteNames = [
    'invitation',
    'login',
    'register',
    'forgotPassword',
    'resetPassword',
  ]

  const authRequired = !publicRouteNames.includes(to.name)
  
  if (!user && authRequired) {
    // TODO: Set the return URL so that when the user logs in, they can return here
    // authStore.returnUrl = to.fullPath
    
    return '/not-authorized'
  }
})

/**
* Restrict route access by role
* Redirect to unauthorized route if you don't have permissions for route
*/
router.beforeEach(async (to) => {
  const { authorize } = to.meta
  const { user } = useAuthStore()
  
  if (authorize) {
    // We could handle unauthenticated route access here
    // if (!user) {
    //   return '/login'
    // }
    
    // Check if route is restricted by role
    if (authorize.length && !authorize.includes(user.role)) {
      return '/not-authorized'
    }
  }
})

/**
* Setup organization
* Get organization from url, persist in auth store for use in api requests
*/
router.beforeEach(async (to) => {
    // TODO: Get rid of this, use the composable
    let store = useAuthStore()
    
    if (to.params.organization) {
        store.organization = to.params.organization
    }
})

export default router
