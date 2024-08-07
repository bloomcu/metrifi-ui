import AdminDashboards from '@/views/admin/AdminDashboards.vue'
import AdminOrganizations from '@/views/admin/AdminOrganizations.vue'

export default [
  {
    path: "/admin/dashboards",
    name: "adminDashboards",
    component: AdminDashboards,
    meta: { authorize: ['admin'] }
  },
  {
    path: "/admin/organizations",
    name: "adminOrganizations",
    component: AdminOrganizations,
    meta: { authorize: ['admin'] }
  },
]
