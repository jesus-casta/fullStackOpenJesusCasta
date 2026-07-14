import { create } from 'zustand'

const useNotificationStore = create((set, get) => ({
  notification: null,
  timer: null,

  showNotification: (message, type = 'success', seconds = 5) => {
    const oldTimer = get().timer

    if (oldTimer) {
      clearTimeout(oldTimer)
    }

    const timer = setTimeout(() => {
      set({ notification: null, timer: null })
    }, seconds * 1000)

    set({ notification: { message, type }, timer })
  },
}))

export default useNotificationStore
