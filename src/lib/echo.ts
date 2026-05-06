import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  wsHost: import.meta.env.VITE_PUSHER_HOST,
  wsPort: parseInt(import.meta.env.VITE_PUSHER_PORT ?? '6001'),
  wssPort: parseInt(import.meta.env.VITE_PUSHER_PORT ?? '6001'),
  forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
})

export default echo
