import type { Metadata, ResolvingMetadata } from 'next'
import { withShareCard } from '../shareCard'
import Landing, { landingMetadata } from '@/components/landing/Landing'

/** Content in constants/landings.ts; template in components/landing. */
export function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return withShareCard(landingMetadata('accessibility'), parent)
}

export default function AccessibilityPage() {
  return <Landing slug="accessibility" />
}
