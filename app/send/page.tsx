import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/primitives'
import { SendForm } from '@/components/send/send-form'

export const metadata: Metadata = { title: 'Send Tokens' }

export default function SendPage() {
  return (
    <>
      <PageIntro
        title="Send CampusCoin"
        description="Transfer CC to a classmate, club or department wallet. You'll review every detail before signing."
      />
      <SendForm />
    </>
  )
}
