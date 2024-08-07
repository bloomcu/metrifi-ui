import auth from '@/views/base/auth/routes/index.js'
import categories from '@/views/base/categories/routes/index.js'
import common from '@/views/base/common/routes/index.js'
import invitations from '@/views/base/invitations/routes/index.js'
import settings from '@/views/base/settings/routes/index.js'
import subscriptions from '@/views/base/subscriptions/routes/index.js'

const baseRoutes = [
  ...auth,
  ...categories,
  ...common,
  ...invitations,
  ...settings,
  ...subscriptions,
]

export default baseRoutes
