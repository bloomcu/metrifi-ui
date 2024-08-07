import AdminDashboards from '@/views/admin/AdminDashboards.vue'

export default [
  {
    path: "/admin/dashboards",
    name: "adminDashboards",
    component: AdminDashboards,
    meta: { authorize: ['admin'] }
  },
]
