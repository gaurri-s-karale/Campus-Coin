import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/primitives'
import { QrPaymentsView } from '@/components/qr/qr-payments-view'

export const metadata: Metadata = { title: 'QR Payments' }

export default function QrPage() {
  return (
    <>
      <PageIntro
        title="QR Payments"
        description="Scan a vendor's CampusCoin QR code to pay the exact amount — no typing addresses."
      />
      <QrPaymentsView />
    </>
  )
}
