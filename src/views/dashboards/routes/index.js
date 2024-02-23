import Dashboards from '@/views/dashboards/Dashboards.vue'
import Dashboard from '@/views/dashboards/Dashboard.vue'

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
