import AdminDashboards from '@/views/admin/AdminDashboards.vue'
import AdminFunnels from '@/views/admin/AdminFunnels.vue'
import AdminOrganizations from '@/views/admin/AdminOrganizations.vue'
import AdminChat from '@/views/admin/AdminChat.vue'

export default [
  {
    path: "/admin/chat",
    name: "adminChat",
    component: AdminChat,
    meta: { authorize: ['admin'] }
  },
  {
    path: "/admin/dashboards",
    name: "adminDashboards",
    component: AdminDashboards,
    meta: { authorize: ['admin'] }
  },
  {
    path: "/admin/funnels",
    name: "adminFunnels",
    component: AdminFunnels,
    meta: { authorize: ['admin'] }
  },
  {
    path: "/admin/organizations",
    name: "adminOrganizations",
    component: AdminOrganizations,
    meta: { authorize: ['admin'] }
  },
]
