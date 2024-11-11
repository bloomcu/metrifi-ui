import { createApp } from 'vue'
import { createGtm } from '@gtm-support/vue-gtm';
import App from '@/App.vue'
import store from '@/store.js'
import router from '@/router.js'
import * as Sentry from "@sentry/vue";
// import websocket from '@/websocket'
// import Echo from 'laravel-echo'
// import Pusher from 'pusher-js'
import AppButton from '@/app/components/base/buttons/AppButton.vue'
import AppCard from '@/app/components/base/cards/AppCard.vue'
import AppInput from '@/app/components/base/forms/AppInput.vue'
import AppSelect from '@/app/components/base/forms/AppSelect.vue'
import AppToggle from '@/app/components/base/forms/AppToggle.vue'
import AppHeader from '@/app/components/base/header/AppHeader.vue'
import AppModal from '@/app/components/base/modals/AppModal.vue'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(
    createGtm({
      id: "GTM-P83WJ25N",
      vueRouter: router
    })
  )
  .component('AppButton', AppButton)
  .component('AppCard', AppCard)
  .component('AppInput', AppInput)
  .component('AppSelect', AppSelect)
  .component('AppToggle', AppToggle)
  .component('AppHeader', AppHeader)
  .component('AppModal', AppModal)

Sentry.init({
  app,
  // environment: import.meta.env.VITE_ENV,
  enabled: import.meta.env.VITE_ENV === 'staging' || import.meta.env.VITE_ENV === 'production',
  dsn: "https://72b08d5732125a3cec895d73d58c96e8@o4507262580948992.ingest.us.sentry.io/4507262581145600",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: 'light',
      showBranding: false,
      triggerLabel: 'Help',
      formTitle: 'Help',
      submitButtonLabel: 'Send',
      successMessageText: 'Thank you for your message!'
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/staging-api\.metrifi\.com\/api/, /^https:\/\/api\.metrifi\.com\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
      
router.isReady().then(() => {
  app.mount('#app')
})



// Setup realtime websockets
// window.Pusher = Pusher

// Use Pusher
// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: import.meta.env.VITE_PUSHER_APP_KEY,
//   cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//   authEndpoint: import.meta.env.VITE_PUSHER_APP_AUTH_ENDPOINT,
//   auth: {
//     headers: {
//       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).access_token
//     }
//   },
//   forceTLS: true,
//   encrypted: true,
//   disableStats: true,
// })
