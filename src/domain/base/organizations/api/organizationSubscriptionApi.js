import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const organizationSubscriptionApi = {        
    show(organization_slug) {
        return HttpClient.get(`/organizations/${organization_slug}/subscription`)
    }
}

export { organizationSubscriptionApi }
