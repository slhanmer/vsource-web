import Landing, { landingMetadata } from '@/components/landing/Landing'

/** Content in constants/landings.ts; template in components/landing. */
export const metadata = landingMetadata('regulated')

export default function RegulatedPage() {
  return <Landing slug="regulated" />
}
