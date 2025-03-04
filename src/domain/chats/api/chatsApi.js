import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const chatsApi = {
  async store(organization, request) {
    return await HttpClient.post(`/${organization}/chats`, request)
  }
}

export { chatsApi }
