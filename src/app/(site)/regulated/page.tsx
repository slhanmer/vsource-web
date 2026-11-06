import type { Metadata, ResolvingMetadata } from 'next'
import { withShareCard } from '../shareCard'
import Landing, { landingMetadata } from '@/components/landing/Landing'

/** Content in constants/landings.ts; template in components/landing. */
export function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return withShareCard(landingMetadata('regulated'), parent)
}

export default function RegulatedPage() {
  return <Landing slug="regulated" />
}
