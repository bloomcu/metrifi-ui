import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const stripeApi = {  
    checkout(organizationSlug, params) {
      return HttpClient.post(`/${organizationSlug}/stripe/checkout`, params)
    },

    visitBillingPortal(organizationSlug) {
      return HttpClient.post(`/${organizationSlug}/stripe/billing`)
    },

    update(organizationSlug) {
      return HttpClient.post(`/${organizationSlug}/stripe/update`)
    },

    cancel(organizationSlug) {
      return HttpClient.post(`/${organizationSlug}/stripe/cancel`)
    },
}

export { stripeApi }
