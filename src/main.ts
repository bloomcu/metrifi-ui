import { createApp } from 'vue'
import App from '@/App.vue'
import store from '@/store.js'
import router from '@/router.js'
// import websocket from '@/websocket'
// import Echo from 'laravel-echo'
// import Pusher from 'pusher-js'
import AppButton from '@/app/components/base/buttons/AppButton.vue'
import AppCard from '@/app/components/base/cards/AppCard.vue'
import AppInput from '@/app/components/base/forms/AppInput.vue'
import AppHeader from '@/app/components/base/header/AppHeader.vue'
import AppModal from '@/app/components/base/modals/AppModal.vue'

const app = createApp(App)
  .use(store)
  .use(router)
  .component('AppButton', AppButton)
  .component('AppCard', AppCard)
  .component('AppInput', AppInput)
  .component('AppHeader', AppHeader)
  .component('AppModal', AppModal)
      
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
