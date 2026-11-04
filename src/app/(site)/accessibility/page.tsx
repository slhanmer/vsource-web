import Landing, { landingMetadata } from '@/components/landing/Landing'

/** Content in constants/landings.ts; template in components/landing. */
export const metadata = landingMetadata('accessibility')

export default function AccessibilityPage() {
  return <Landing slug="accessibility" />
}
