import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const stripeApi = {  
    checkout(organizationSlug, params) {
      return HttpClient.post(`/${organizationSlug}/stripe/checkout`, params)
    },

    billing(organizationSlug) {
      return HttpClient.post(`/${organizationSlug}/stripe/billing`)
    },

    cancel(organizationSlug) {
      return HttpClient.post(`/${organizationSlug}/stripe/cancel`)
    },
}

export { stripeApi }
