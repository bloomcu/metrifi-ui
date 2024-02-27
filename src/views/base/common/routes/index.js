import NotFound from '@/views/base/common/NotFound.vue'
import NotAuthorized from '@/views/base/common/NotAuthorized.vue';

export default [
  {
    path: '/:catchAll(.*)*',
    name: 'notFound',
    component: NotFound,
  },
  {
    path: '/not-found',
    name: 'notFound',
    component: NotFound,
  },
  {
    path: "/not-authorized",
    name: "NotAuthorized",
    component: NotAuthorized,
  },
]
