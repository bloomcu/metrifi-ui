import Explore from '@/views/explore/Explore.vue'

export default [
  {
    path: "/:organization/explore/:connection?",
    name: "explore",
    component: Explore,
  },
]
