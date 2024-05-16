import Categories from '@/views/base/categories/Categories.vue'

export default [
  {
    path: "/categories",
    name: "categories",
    component: Categories,
    meta: { authorize: ['admin'] }
  },
]
