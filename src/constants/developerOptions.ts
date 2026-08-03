export const ROTATION_INTERVAL_MS: number = 5 * 60 * 1000 // 5 minutes
export const HEARTBEAT_INTERVAL: number = 30000 // 30 seconds
export const MAX_HEARTBEAT_FAILS: number = 3
export const WIP_ROUTES: string[] = [
  // '/admin/tenant-config',
]
export const DESKTOP_ONLY_ROUTES: string[] = [
  '/admin/tenant-config',
  '/admin/form-creation',
  '/dictionary-manager',
  '/event-viewer',
  '/file-explorer',
  '/bug-reports',
]
export const NO_NAV_MENU_ROUTES: string[] = ['/welcome']
export const CONTACT_MENU_ROUTES: string[] = []
export const PUBLIC_ROUTES = ['/login', '/register', '/view-notification']
