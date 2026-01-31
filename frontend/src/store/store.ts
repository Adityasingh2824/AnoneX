import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// UI State
interface UIState {
  theme: 'dark' | 'light' | 'system'
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  setTheme: (theme: 'dark' | 'light' | 'system') => void
  toggleSidebar: () => void
  setMobileMenuOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    {
      name: 'anonex-ui-storage',
    }
  )
)

// Auth State
interface AuthState {
  isAuthenticated: boolean
  address: string | null
  pseudonym: string | null
  viewKey: string | null
  setAuth: (auth: { address: string; pseudonym: string; viewKey?: string }) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      address: null,
      pseudonym: null,
      viewKey: null,
      setAuth: ({ address, pseudonym, viewKey }) =>
        set({
          isAuthenticated: true,
          address,
          pseudonym,
          viewKey: viewKey || null,
        }),
      clearAuth: () =>
        set({
          isAuthenticated: false,
          address: null,
          pseudonym: null,
          viewKey: null,
        }),
    }),
    {
      name: 'anonex-auth-storage',
    }
  )
)

// Post Draft State (not persisted)
interface DraftState {
  content: string
  visibility: 'public' | 'private' | 'group'
  groupId: string | null
  setContent: (content: string) => void
  setVisibility: (visibility: 'public' | 'private' | 'group') => void
  setGroupId: (groupId: string | null) => void
  clearDraft: () => void
}

export const useDraftStore = create<DraftState>((set) => ({
  content: '',
  visibility: 'public',
  groupId: null,
  setContent: (content) => set({ content }),
  setVisibility: (visibility) => set({ visibility }),
  setGroupId: (groupId) => set({ groupId }),
  clearDraft: () => set({ content: '', visibility: 'public', groupId: null }),
}))

// Notification State
interface NotificationState {
  unreadCount: number
  notifications: Array<{
    id: string
    type: string
    message: string
    timestamp: Date
    read: boolean
  }>
  addNotification: (notification: Omit<NotificationState['notifications'][0], 'id' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, id: Date.now().toString(), read: false },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}))
