import axios from 'axios'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'

/**
* Setup Http client
* An instance of Axios we can use for all API requests to CMS
*/
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'content-type': 'application/json'
  }
})

/**
* Intercept requests
*/
httpClient.interceptors.request.use((config) => {  
  /**
  * Authenticate request
  * Return auth header with access token if user is logged in
  */
  const { user } = useAuthStore()
  if (!!user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`
  }
  
  return config
  
}, (error) => {
  
  Promise.reject(error) 
})

/**
* Intercept responses
*/
httpClient.interceptors.response.use((response) => {
  const { emptyErrors } = useErrorStore()
  emptyErrors()
  
  return response 
  
}, (error) => {
  // Network failures (server down, DNS, CORS preflight, aborted) have no response.
  // Bail out before reading status/data so we don't mask the real error.
  if (!error.response) {
    console.error('Network error:', error.message)
    return Promise.reject(error)
  }

  const status = error.response.status
  const data = error.response.data ?? {}
  console.log('Error status: ', status)
  console.log('Error message: ', data.message)
  console.log('Error errors: ', data.errors)

  /**
  * Catch validation errors
  * Commit validation errors to the global app error store
  */
  if (status === 422) {
    const { setErrors } = useErrorStore()
    setErrors(data.errors)
  }

  /**
  * Catch internal server errors
  * Commit errors to the global app error store
  */
  if (status === 500) {
    const { setServerError } = useErrorStore()
    setServerError('There has been a server error. Please refresh. Changes may be lost.')
  }

  /**
  * Catch not found request
  * Redirect to 404 page if 404 Not Found response is returned from api
  */
  if (status === 404) {
    // const { setServerError } = useErrorStore()
    // setServerError('This endpoint could not be found. Please refresh. Changes may be lost.')

    // document.location.href = '/not-found'
  }

  /**
  * Catch unauthorized request (expired/invalid token)
  * Clear stored user data and redirect to login with session expired message
  */
  if (status === 401) {
    localStorage.removeItem('user')
    document.location.href = '/login?session_expired=true'
  }

  /**
  * Catch forbidden request (authenticated but not allowed)
  * Redirect to not-authorized page
  */
  if (status === 403) {
    document.location.href = '/not-authorized'
  }

  // return error
  return Promise.reject(error)
})

export { httpClient }
