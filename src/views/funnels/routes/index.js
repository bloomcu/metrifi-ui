import Funnels from '@/views/funnels/Funnels.vue'

export default [
  {
    path: "/:organization/funnels",
    name: "funnels",
    component: Funnels,
  },
]
