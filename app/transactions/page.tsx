import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/primitives'
import { TransactionsView } from '@/components/transactions/transactions-view'

export const metadata: Metadata = { title: 'Transactions' }

export default function TransactionsPage() {
  return (
    <>
      <PageIntro
        title="Transaction history"
        description="Every payment, transfer and reward on your CampusCoin wallet."
      />
      <TransactionsView />
    </>
  )
}
