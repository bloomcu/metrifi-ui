import Funnels from '@/views/funnels/Funnels.vue'
import Funnel from '@/views/funnels/Funnel.vue'

export default [
  {
    path: "/:organization/funnels",
    name: "funnels",
    component: Funnels,
  },
  {
    path: "/:organization/funnels/:funnel",
    name: "funnel",
    component: Funnel,
  },
]
