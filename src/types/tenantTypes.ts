/** A named contact person within a tenant organisation (primary, technical, or financial). */
export type TenantUser = {
  name: string
  email?: string | null
  position: string
}

/** Physical street address used for a tenant's registered or postal location. */
export type TenantAddress = {
  streetNumber: string
  streetName: string
  suburb: string
  state: string
  postCode: string
  poBox?: string | null
}

/** Regulatory and contact identifiers for an RTO tenant. */
export type TenantContactDetails = {
  /** Australian Business Number */
  abn: string
  /** Australian Company Number */
  acn: string
  /** Registered Training Organisation number, if applicable */
  rtoNumber?: string | null
  phone: string
  secondaryPhone?: string | null
  website?: string | null
  email: string | null
  location?: string | null
}

/**
 * Tenant brand colour tokens injected as CSS variables at runtime.
 * All values are hex strings (e.g. `#1A2B3C`).
 */
export type TenantColours = {
  primary: string
  secondary: string
  highlight: string
  background: string
  font: string
  fontSecondary: string
}

/**
 * Full tenant configuration loaded on login and stored in the tenant store.
 * Drives branding, contact info, and CSS variable injection for multi-tenancy.
 * When `isBaseDomain` is true the platform falls back to `PLATFORM_BRANDING`.
 */
export type TenantConfig = {
  uuid: string
  companyName: string
  companyShortName?: string | null
  /** URL or path to the tenant's logo asset */
  logoFullLight?: string
  logoFullDark?: string
  logoLight?: string
  logoDark?: string
  /** URL or path to the tenant's header banner */
  header?: string
  footer?: string | null
  watermark?: string | null
  primaryUser: TenantUser
  technicalUser?: TenantUser | null
  financialUser?: TenantUser | null
  contactDetails: TenantContactDetails
  address: TenantAddress
  postalAddress?: TenantAddress | null
  colours: TenantColours
  /** True when the request is from the root domain with no tenant subdomain */
  isBaseDomain: boolean
}

/** Default platform branding used when no tenant subdomain is detected. */
export const PLATFORM_BRANDING = {
  logoFullLight: '/branding/aptium_full_logo_light_vector.svg',
  logoFullDark: '/branding/aptium_full_logo_dark_vector.svg',
  logoLight: '/branding/aptium_mark_light_vector.svg',
  logoDark: '/branding/aptium_mark_dark_vector.svg',
  header: '',
  footer: '',
  watermark: '',
  companyName: 'Test Client 1',
}
