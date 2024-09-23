import Recommendation from '@/views/recommendations/Recommendation.vue'

export default [
  {
    path: "/:organization/:dashboard/recommendation/:recommendation",
    name: "recommendation",
    component: Recommendation,
  },
]
