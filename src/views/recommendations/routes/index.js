import Recommendation from '@/views/recommendations/Recommendation.vue'

export default [
  {
    // path: "/:organization/:recommendation",
    path: "/:organization/recommendation",
    name: "recommendation",
    component: Recommendation,
  },
]
