import Recommendations from '@/views/recommendations/Recommendations.vue'
import RecommendationEdit from '@/views/recommendations/RecommendationEdit.vue'
import Recommendation from '@/views/recommendations/Recommendation.vue'
import RecommendationPushToWordPress from '@/views/recommendations/RecommendationPushToWordPress.vue'

export default [
    {
        path: "/:organization/recommendations",
        name: "recommendations",
        component: Recommendations,
    },
    {
        path: "/:organization/recommendations/:recommendation/edit",
        name: "recommendationEdit",
        component: RecommendationEdit,
    },
    {
        path: "/:organization/recommendations/:recommendation",
        name: "recommendation",
        component: Recommendation,
    },
    {
        path: "/:organization/recommendations/:recommendation/push-to-wordpress",
        name: "recommendation-push-to-wordpress",
        component: RecommendationPushToWordPress,
    },
]
