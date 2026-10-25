import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/primitives'
import { VendorDashboard } from '@/components/vendor/vendor-dashboard'

export const metadata: Metadata = { title: 'Vendor Dashboard' }

export default function VendorPage() {
  return (
    <>
      <PageIntro
        title="Vendor Dashboard"
        description="Accept CampusCoin at your counter, track today's sales and review incoming payments."
      />
      <VendorDashboard />
    </>
  )
}
