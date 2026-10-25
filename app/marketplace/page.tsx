import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/primitives'
import { MarketplaceView } from '@/components/marketplace/marketplace-view'

export const metadata: Metadata = { title: 'Campus Marketplace' }

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  return (
    <>
      <PageIntro
        title="Campus Marketplace"
        description="Pay registered canteens, stationers, print shops and event organisers directly with CampusCoin."
      />
      <MarketplaceView key={category ?? 'all'} initialCategory={category} />
    </>
  )
}
