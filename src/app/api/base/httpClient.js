import axios from 'axios'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'

/**
* Setup Http client
* An instance of Axios we can use for all API requests to CMS
*/
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
  console.log('Error status: ', error.response.status)
  console.log('Error message: ', error.response.data.message)
  console.log('Error errors: ', error.response.data.errors)
  
  /**
  * Catch validation errors
  * Commit validation errors to the global app error store
  */
  if ([422].includes(error.response.status)) {
    const { setErrors } = useErrorStore()
    setErrors(error.response.data.errors)
  }

  /**
  * Catch internal server errors
  * Commit errors to the global app error store
  */
  if ([500].includes(error.response.status)) {
    const { setServerError } = useErrorStore()
    setServerError('There has been a server error. Please refresh. Changes may be lost.')
  }

  /**
  * Catch not found request
  * Redirect to 404 page if 404 Not Found response is returned from api
  */
  if ([404].includes(error.response.status)) {
    const { setServerError } = useErrorStore()
    setServerError('This endpoint could not be found. Please refresh. Changes may be lost.')
  }
  
  /**
  * Catch unauthorized request
  * Logout if 401 Unauthorized or 403 Forbidden response is returned from api
  */
  if ([401, 403].includes(error.response.status)) {
    // Todo: Send user to an "Unauthorized" page
    document.location.href = '/logout'
  }
  
  // return error
  return Promise.reject(error)
})

export { httpClient }
