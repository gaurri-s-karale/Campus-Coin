import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/primitives'
import { RewardsView } from '@/components/rewards/rewards-view'

export const metadata: Metadata = { title: 'Rewards' }

export default function RewardsPage() {
  return (
    <>
      <PageIntro
        title="Campus rewards"
        description="Earn CampusCoin for attending events, volunteering and building good campus habits."
      />
      <RewardsView />
    </>
  )
}
