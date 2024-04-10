import Dashboards from '@/views/dashboards/Dashboards.vue'
import DashboardBar from '@/views/dashboards/DashboardBar.vue'
import DashboardLine from '@/views/dashboards/DashboardLine.vue'

export default [
  {
    path: "/:organization",
    name: "dashboards",
    component: Dashboards,
  },
  {
    path: "/:organization/:dashboard",
    name: "dashboard",
    component: DashboardBar,
  },
]
