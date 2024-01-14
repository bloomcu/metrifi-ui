import Integrations from '@/views/integrations/Integrations.vue'
import Google from '@/views/integrations/google/Google.vue'

export default [
  {
    path: "/:organization/integrations",
    name: "integrations",
    component: Integrations,
  },
  {
    path: "/integrations/google",
    name: "google",
    component: Google,
  },
]
