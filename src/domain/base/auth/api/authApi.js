import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const authApi = {
  /**
   * Log in
   *
   * @param string email
   * @param string password
   * @return promise
   */
  login(email, password) {
    return HttpClient.post(`/auth/login`, {
      email: email,
      password: password,
    })
  },
  
  /**
   * Log out
   *
   * @return promise
   */
  logout() {
    return HttpClient.post(`/auth/logout`)
  },
  
  /**
   * Register new user
   *
   * @param String name
   * @param String email
   * @param String password
   * @param String password_confirmation [repeated password]
   * @return promise
   */
  register(name, email, organization_title, password, password_confirmation, accept_terms) {
    return HttpClient.post(`/auth/register`, {
      name: name,
      email: email,
      organization_title: organization_title,
      password: password,
      password_confirmation: password_confirmation, 
      accept_terms: accept_terms,
    })
  },
  
  /**
   * Register new user with an invitation
   *
   * @param String invitation_uuid
   * @param String name
   * @param String email
   * @param String password
   * @param String password_confirmation [repeated password]
   * @return promise
   */
  registerWithInvitation(invitation_uuid, name, email, password, password_confirmation, accept_terms) {
    return HttpClient.post(`/auth/register/invitation/${invitation_uuid}`, {
      name: name,
      email: email,
      password: password,
      password_confirmation: password_confirmation, 
      accept_terms: accept_terms,
    })
  },
  
  /**
   * Request a password reset
   *
   * @param string email
   * @return promise
   */
  requestPasswordReset(email) {
    return HttpClient.post(`/auth/password/forgot`, {
      email: email,
    })
  },
  
  /**
   * Reset password
   *
   * @param string token
   * @param string email
   * @param string password
   * @param string password_confirmation
   * @return promise
   */
  resetPassword(token, email, password, password_confirmation) {
    return HttpClient.post(`/auth/password/reset`, {
      token: token,
      email: email,
      password: password,
      password_confirmation: password_confirmation, 
    })
  },
}

export { authApi }
