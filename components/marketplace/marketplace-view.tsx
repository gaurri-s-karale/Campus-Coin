'use client'

import { useMemo, useState } from 'react'
import { Clock, MapPin, Search, Star, Store } from 'lucide-react'
import { Segmented } from '@/components/ui/segmented'
import { Input } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { DemoBadge, EmptyState } from '@/components/shared/primitives'
import { TransferConfirmModal, type TransferDetails } from '@/components/shared/transfer-confirm-modal'
import { categoryMeta, categoryOrder } from '@/lib/categories'
import { demoVendors } from '@/lib/demo-data'
import { formatCC } from '@/lib/format'
import type { Product, Vendor, VendorCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

type Filter = 'all' | VendorCategory

function VendorCard({ vendor, onPay }: { vendor: Vendor; onPay: (vendor: Vendor, product: Product) => void }) {
  const meta = categoryMeta[vendor.category]
  const Icon = meta.icon
  return (
    <article className="flex flex-col rounded-xl border bg-card">
      <header className="flex items-start gap-3 border-b p-5">
        <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', meta.tint)}>
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug">{vendor.name}</h3>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium">
              <Star className="size-3.5 fill-warning text-warning" aria-hidden />
              {vendor.rating.toFixed(1)}
              <span className="sr-only">out of 5</span>
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" aria-hidden /> {vendor.location}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" aria-hidden /> {vendor.hours}
          </p>
        </div>
      </header>
      <ul className="flex flex-1 flex-col divide-y">
        {vendor.products.map((product) => (
          <li key={product.id} className="flex items-center gap-3 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-medium">
                {product.name}
                {product.tag && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                    {product.tag}
                  </span>
                )}
              </p>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-semibold tabular-nums">{formatCC(product.price)}</span>
              <Button
                size="sm"
                className="rounded-lg"
                onClick={() => onPay(vendor, product)}
                aria-label={`Pay ${formatCC(product.price)} for ${product.name} at ${vendor.name}`}
              >
                Pay
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}

export function MarketplaceView({ initialCategory }: { initialCategory?: string }) {
  const [filter, setFilter] = useState<Filter>(
    categoryOrder.includes(initialCategory as VendorCategory) ? (initialCategory as VendorCategory) : 'all',
  )
  const [query, setQuery] = useState('')
  const [details, setDetails] = useState<TransferDetails | null>(null)

  const vendors = useMemo(() => {
    const q = query.trim().toLowerCase()
    return demoVendors.filter(
      (v) =>
        (filter === 'all' || v.category === filter) &&
        (!q ||
          v.name.toLowerCase().includes(q) ||
          v.products.some((p) => p.name.toLowerCase().includes(q))),
    )
  }, [filter, query])

  const options = [
    { value: 'all' as const, label: 'All', count: demoVendors.length },
    ...categoryOrder.map((c) => ({
      value: c,
      label: categoryMeta[c].label,
      count: demoVendors.filter((v) => v.category === c).length,
    })),
  ]

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Segmented value={filter} onChange={setFilter} options={options} label="Filter vendors by category" />
        <div className="flex items-center gap-3">
          <DemoBadge label="Demo vendors" />
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vendors or items"
              aria-label="Search vendors or items"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {vendors.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No vendors found"
          description="Try a different search term or category."
          action={
            <Button variant="outline" onClick={() => { setQuery(''); setFilter('all') }}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onPay={(v, p) =>
                setDetails({
                  to: v.address,
                  amount: String(p.price),
                  label: v.name,
                  note: p.name,
                  type: 'payment',
                  demo: true,
                  extraRows: [
                    { label: 'Item', value: p.name },
                    { label: 'Category', value: categoryMeta[v.category].label },
                  ],
                })
              }
            />
          ))}
        </div>
      )}

      <TransferConfirmModal
        open={details !== null}
        details={details}
        title="Confirm vendor payment"
        onClose={() => setDetails(null)}
      />
    </>
  )
}
