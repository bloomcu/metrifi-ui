import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const stripeApi = {  
    checkout(organizationSlug, params) {
      return HttpClient.post(`/${organizationSlug}/stripe/checkout`, params)
    },

    cancel(organizationSlug) {
      return HttpClient.post(`/${organizationSlug}/stripe/cancel`)
    },
}

export { stripeApi }
