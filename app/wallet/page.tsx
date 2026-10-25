import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/primitives'
import { WalletView } from '@/components/wallet/wallet-view'

export const metadata: Metadata = { title: 'My Wallet' }

export default function WalletPage() {
  return (
    <>
      <PageIntro title="My Wallet" description="Manage your wallet connection, network and CampusCoin token details." />
      <WalletView />
    </>
  )
}
