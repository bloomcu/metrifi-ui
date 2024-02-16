import Dashboards from '@/views/dashboard/Dashboards.vue'
import Dashboard from '@/views/dashboard/Dashboard.vue'

export default [
  {
    path: "/:organization",
    name: "dashboards",
    component: Dashboards,
  },
  {
    path: "/:organization/:dashboard",
    name: "dashboard",
    component: Dashboard,
  },
]
