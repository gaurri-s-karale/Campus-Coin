import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/primitives'
import { SettingsView } from '@/components/settings/settings-view'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <>
      <PageIntro title="Settings" description="Your profile, connected wallet and network configuration." />
      <SettingsView />
    </>
  )
}
