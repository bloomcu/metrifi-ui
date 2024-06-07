import Welcome from '@/views/welcome/Welcome.vue'

export default [
  {
    path: "/:organization/welcome",
    name: "welcome",
    component: Welcome,
  },
]
