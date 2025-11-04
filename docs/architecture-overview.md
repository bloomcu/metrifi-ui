# Architecture Overview

This document provides a high-level overview of the Metrifi Vue 3 application architecture, covering project structure, API integration patterns, state management, and authentication/authorization flows.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Application Architecture](#application-architecture)
3. [API Integration](#api-integration)
4. [State Management with Pinia](#state-management-with-pinia)
5. [Authentication & Authorization](#authentication--authorization)
6. [Routing](#routing)
7. [Key Patterns & Conventions](#key-patterns--conventions)

---

## Project Structure

The application follows a domain-driven design approach with clear separation of concerns:

```
src/
├── app/                    # Core application infrastructure
│   ├── api/               # Base HTTP client configuration
│   ├── components/        # Reusable base components
│   ├── composables/       # Shared Vue composables
│   ├── layouts/           # Application layout components
│   ├── store/             # Base stores (error handling, etc.)
│   └── styles/            # Global styles
│
├── domain/                # Domain-specific modules
│   ├── admin/            # Admin functionality
│   ├── analyses/         # Analysis features
│   ├── base/             # Core domain features (auth, users, orgs)
│   ├── benchmarks/       # Benchmark features
│   ├── dashboards/       # Dashboard features
│   ├── funnels/          # Funnel features
│   ├── recommendations/  # Recommendation features
│   └── [other domains]/  # Additional domain modules
│
├── views/                 # Page components organized by feature
├── routes/                # Route definitions
├── components/            # Shared components (legacy location)
├── App.vue               # Root component
├── main.js               # Application entry point
├── router.js             # Router configuration
└── store.js              # Pinia store configuration
```

### Domain Module Structure

Each domain module follows a consistent structure:

```
domain/[feature]/
├── api/                  # API service layer
│   └── [feature]Api.js
├── components/           # Feature-specific components
├── composables/          # Feature-specific composables
├── store/                # Pinia stores for state management
│   └── use[Feature]Store.js
└── constants/            # Feature-specific constants
```

---

## Application Architecture

### Core Technologies

- **Vue 3** with Composition API and `<script setup>` syntax
- **Pinia** for state management
- **Vue Router** for routing
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **Vite** for build tooling

### Application Bootstrap (main.js)

The application initializes with:

1. **Vue App Creation**: Creates the Vue app instance
2. **Pinia Store**: Registers the global Pinia store
3. **Vue Router**: Configures routing with history mode
4. **Google Tag Manager**: Integrates GTM for analytics (production only)
5. **Sentry**: Error tracking and monitoring (staging/production)
6. **Global Components**: Registers commonly used base components globally:
   - `AppButton`, `AppCard`, `AppInput`, `AppSelect`, `AppToggle`, `AppHeader`, `AppModal`

---

## API Integration

### HTTP Client Configuration

The application uses a centralized Axios instance (`httpClient`) configured in `src/app/api/base/httpClient.js`:

```javascript
// Base configuration
baseURL: import.meta.env.VITE_API_BASE_URL
headers: { 'content-type': 'application/json' }
```

### Request Interceptor

**Authentication**: Automatically attaches JWT bearer token to all requests:

```javascript
// Adds Authorization header if user is logged in
config.headers.Authorization = `Bearer ${user.access_token}`
```

### Response Interceptor

Handles various response scenarios:

- **Success (2xx)**: Clears any existing validation errors
- **Validation Errors (422)**: Stores errors in global error store for form display
- **Server Errors (500)**: Sets server error message in error store
- **Unauthorized (401/403)**: Redirects to `/not-authorized` page
- **Not Found (404)**: Can redirect to 404 page (currently commented out)

### API Service Pattern

Each domain feature has its own API service file that exports methods for backend communication:

```javascript
// Example: src/domain/funnels/api/funnelApi.js
const funnelApi = {
  async index(organization, params) {
    return await HttpClient.get(`/${organization}/funnels`, { params })
  },
  
  async store(organization, funnel) {
    return await HttpClient.post(`/${organization}/funnels`, funnel)
  },
  
  async show(organization, id) {
    return await HttpClient.get(`/${organization}/funnels/${id}`)
  },
  
  async update(organization, id, funnel) {
    return await HttpClient.put(`/${organization}/funnels/${id}`, funnel)
  },
  
  async destroy(organization, id) {
    return await HttpClient.delete(`/${organization}/funnels/${id}`)
  }
}
```

**Key Patterns**:
- Organization slug is typically the first URL parameter
- Standard REST conventions (index, store, show, update, destroy)
- Returns Axios promises for flexible error handling
- Params passed as query strings or request body

---

## State Management with Pinia

### Store Configuration

Pinia is configured in `src/store.js` with router injection:

```javascript
const store = createPinia()

// Inject router into all stores for navigation
store.use(({ store }) => {
  store.router = markRaw(router)
})
```

This allows any store to access `this.router` for programmatic navigation.

### Store Pattern

Stores follow the Composition API pattern with `defineStore`:

```javascript
export const useFunnelStore = defineStore('funnelStore', () => {
  // State
  const funnels = ref([])
  const funnel = ref(null)
  const isLoading = ref(false)
  
  // Actions
  async function show(organization_id, funnel_id) {
    funnel.value = null
    await funnelApi.show(organization_id, funnel_id)
      .then(response => {
        funnel.value = response.data.data
      })
  }
  
  // Return public API
  return {
    funnels,
    funnel,
    isLoading,
    show
  }
})
```

### Store Organization

Stores are organized by domain:

- **Base Stores** (`src/app/store/base/`): Core functionality
  - `useErrorStore`: Global error and validation error handling
  
- **Domain Stores** (`src/domain/[feature]/store/`): Feature-specific state
  - `useAuthStore`: Authentication state and user data
  - `useOrganizationStore`: Current organization context
  - `useFunnelStore`: Funnel data and operations
  - etc.

### Common Store Patterns

1. **Loading States**: Track async operation status (`isLoading`, `isSaving`)
2. **API Integration**: Call API services from store actions
3. **Local Storage**: Persist critical data (e.g., user auth token)
4. **Router Access**: Navigate after successful operations
5. **Error Handling**: Let HTTP interceptor handle errors, stores focus on success paths

---

## Authentication & Authorization

### Authentication Flow

#### Login Process

1. User submits credentials via login form
2. `useAuthStore.login()` calls `authApi.login()`
3. On success:
   - User data (including JWT token) stored in `localStorage`
   - User object set in store state
   - Organization context established
   - Redirect based on user role:
     - **Admin**: → `/admin/funnels`
     - **Regular User**: 
       - If onboarding incomplete → `/welcome`
       - If onboarding complete → configured redirect route

#### Registration Process

Similar flow with two paths:
- **Standard Registration**: `authApi.register()` - Creates new organization
- **Invitation Registration**: `authApi.registerWithInvitation()` - Joins existing organization

#### Token Management

- JWT access token stored in `localStorage` as part of user object
- Token automatically attached to all API requests via HTTP interceptor
- Token validated on each request by backend
- Invalid/expired tokens trigger 401 response → redirect to `/not-authorized`

### Authorization

#### Role-Based Access Control

The application supports role-based authorization:

```javascript
// User roles
- 'admin': Full system access
- 'editor': Organization-level access
- [other roles as defined]
```

#### Route Protection

Routes can specify authorization requirements in meta:

```javascript
{
  path: '/admin/organizations',
  name: 'adminOrganizations',
  component: AdminOrganizations,
  meta: {
    authorize: ['admin']  // Only admins can access
  }
}
```

#### Router Guards

Multiple `beforeEach` guards enforce security:

1. **Clear Validation Errors**: Resets form errors on navigation
2. **Hydrate Organization**: Loads organization data when org slug changes
3. **Require Authentication**: Redirects to `/login` if not authenticated
4. **Check Role Authorization**: Redirects to `/not-authorized` if insufficient permissions
5. **Set Organization Context**: Persists organization slug in auth store

#### Store-Level Authorization

Stores can check user role via getters:

```javascript
getters: {
  isAdmin: (state) => state.user.role === 'admin',
  isEditor: (state) => state.user.role === 'editor',
}
```

---

## Routing

### Router Configuration

The router uses Vue Router with HTML5 history mode and modular route definitions:

```javascript
// Routes imported from feature modules
import baseRoutes from '@/routes/base/routes.js'
import admin from '@/views/admin/routes/index.js'
import benchmarks from '@/views/benchmarks/routes/index.js'
// ... other feature routes

const routes = [
  ...baseRoutes,
  ...admin,
  ...benchmarks,
  // ... spread all feature routes
]
```

### Route Organization

Routes are organized by feature in `src/views/[feature]/routes/`:

```javascript
// Example: src/views/funnels/routes/index.js
export default [
  {
    path: '/:organization/funnels',
    name: 'funnels',
    component: Funnels,
    meta: { authorize: [] }  // Requires auth, any role
  },
  {
    path: '/:organization/funnels/:id',
    name: 'funnel',
    component: Funnel,
    meta: { authorize: [] }
  }
]
```

### Organization Context

Most routes include `:organization` parameter for multi-tenancy:

```
/:organization/funnels
/:organization/dashboards
/:organization/recommendations
```

This organization slug is:
- Extracted from URL params
- Stored in auth store
- Used in API requests
- Validated/hydrated on route changes

---

## Key Patterns & Conventions

### Component Patterns

1. **Script Setup**: Always use `<script setup>` syntax
2. **Import Order**:
   ```javascript
   // 1. Vue/library imports
   // 2. Composables
   // 3. Stores
   // 4. API services
   // 5. Components
   // 6. Layouts (last)
   ```
3. **Path Aliases**: Use `@/` for imports from `src/`
4. **Base Components**: Reuse components from `src/app/components/base/` before creating new ones

### Styling

- **Tailwind CSS**: Primary styling approach
- **No TypeScript**: Project uses JavaScript (leave existing TS if present)

### API Request Pattern

```javascript
// In component or composable
import { useFunnelStore } from '@/domain/funnels/store/useFunnelStore'

const funnelStore = useFunnelStore()

// Call store action
await funnelStore.show(organizationSlug, funnelId)

// Access reactive state
const funnel = computed(() => funnelStore.funnel)
```

### Error Handling

- **Validation Errors**: Automatically captured and stored by HTTP interceptor
- **Display**: Components access errors from `useErrorStore`
- **Server Errors**: Displayed via global error message
- **Network Errors**: Handled by Axios interceptor

### Environment Variables

Configuration via `.env` file:

```
VITE_API_BASE_URL=https://api.example.com
VITE_ENV=development|staging|production
VITE_REDIRECT_FROM_LOGIN_ROUTE=dashboards
```

---

## Summary

This Vue 3 application follows modern best practices with:

- **Clear separation of concerns** via domain-driven structure
- **Centralized API management** with interceptors for auth and error handling
- **Reactive state management** using Pinia stores
- **Robust authentication** with JWT tokens and role-based authorization
- **Protected routing** with multiple security guards
- **Consistent patterns** across features for maintainability

The architecture supports multi-tenant organizations, provides excellent developer experience with Vue 3 Composition API, and maintains clean boundaries between UI, state, and API layers.
