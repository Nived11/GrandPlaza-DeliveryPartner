import Pusher from 'pusher-js';

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || '090ea1adb4d94c205f51';
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2';

let pusherInstance: Pusher | null = null;

export const getPusherClient = (): Pusher | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!pusherInstance) {
    pusherInstance = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
    });
  }

  return pusherInstance;
};
