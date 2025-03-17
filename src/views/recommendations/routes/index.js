import Recommendation from '@/views/recommendations/Recommendation.vue'
import RecommendationPushToWordPress from '@/views/recommendations/RecommendationPushToWordPress.vue'

export default [
  {
    path: "/:organization/:dashboard/recommendation/:recommendation",
    name: "recommendation",
    component: Recommendation,
  },
  {
    path: "/:organization/:dashboard/recommendation/:recommendation/push-to-wordpress",
    name: "recommendation-push-to-wordpress",
    component: RecommendationPushToWordPress,
  },
]
