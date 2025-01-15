import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const organizationApi = {        
    show(organization_slug) {
      return HttpClient.get(`/organizations/${organization_slug}`)
    },

    update(organization_slug, organization) {
      return HttpClient.put(`/organizations/${organization_slug}`, organization)
    },

    destroy(organization_slug) {
        return HttpClient.delete(`/organizations/${organization_slug}`)
    },

    showSubscription(organization_slug) {
        return HttpClient.get(`/organizations/${organization_slug}/subscription`)
    },

    sendWeeklyAnalysisEmail(organization_slug) {
        return HttpClient.get(`/organizations/${organization_slug}/weekly-analysis-email`)
    },
}

export { organizationApi }
