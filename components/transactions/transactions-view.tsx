'use client'

import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, ListFilter, Search } from 'lucide-react'
import { Input, Select } from '@/components/ui/field'
import { Segmented } from '@/components/ui/segmented'
import { Button } from '@/components/ui/button'
import { DemoBadge, EmptyState, StatCard, StatusBadge, TxHash } from '@/components/shared/primitives'
import { TxAmount, TxTypeIcon, txTypeMeta } from '@/components/shared/transaction-items'
import { useSessionTransactions } from '@/hooks/use-session-transactions'
import { demoTransactions } from '@/lib/demo-data'
import { formatCC, formatDate, formatTime } from '@/lib/format'
import type { TransactionStatus, TransactionType } from '@/lib/types'

type TypeFilter = 'all' | TransactionType

export function TransactionsView() {
  const { transactions: session } = useSessionTransactions()
  const all = useMemo(() => [...session, ...demoTransactions], [session])
  const [type, setType] = useState<TypeFilter>('all')
  const [status, setStatus] = useState<'all' | TransactionStatus>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter(
      (tx) =>
        (type === 'all' || tx.type === type) &&
        (status === 'all' || tx.status === status) &&
        (!q ||
          tx.counterparty.toLowerCase().includes(q) ||
          tx.hash.toLowerCase().includes(q) ||
          tx.note?.toLowerCase().includes(q)),
    )
  }, [all, type, status, query])

  const confirmed = all.filter((t) => t.status === 'confirmed')
  const inflow = confirmed.filter((t) => t.type === 'received' || t.type === 'reward').reduce((s, t) => s + t.amount, 0)
  const outflow = confirmed.filter((t) => t.type === 'sent' || t.type === 'payment').reduce((s, t) => s + t.amount, 0)

  const typeOptions = (['all', 'payment', 'sent', 'received', 'reward'] as const).map((v) => ({
    value: v,
    label: v === 'all' ? 'All' : txTypeMeta[v].label,
  }))

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Money in" value={formatCC(inflow)} icon={ArrowDownLeft} tone="success" hint="Received + rewards" />
        <StatCard label="Money out" value={formatCC(outflow)} icon={ArrowUpRight} hint="Sent + vendor payments" />
        <StatCard
          label="Transactions"
          value={String(all.length)}
          icon={ListFilter}
          hint={session.length ? `${session.length} on-chain this session` : <DemoBadge />}
        />
      </div>

      <section aria-label="Transaction history" className="rounded-xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
          <Segmented value={type} onChange={setType} options={typeOptions} label="Filter by transaction type" />
          <div className="flex gap-2">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'all' | TransactionStatus)}
              aria-label="Filter by status"
              className="w-36"
            >
              <option value="all">All statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </Select>
            <div className="relative flex-1 lg:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, note or hash"
                aria-label="Search transactions"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={ListFilter}
              title="No matching transactions"
              description="Adjust the filters or search to see more results."
              action={
                <Button variant="outline" onClick={() => { setType('all'); setStatus('all'); setQuery('') }}>
                  Reset filters
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th scope="col" className="px-4 py-3 font-medium">Transaction</th>
                    <th scope="col" className="px-4 py-3 font-medium">Date</th>
                    <th scope="col" className="px-4 py-3 font-medium">Status</th>
                    <th scope="col" className="px-4 py-3 font-medium">Hash</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <TxTypeIcon type={tx.type} />
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 font-medium">
                              {tx.counterparty}
                              {tx.source === 'demo' && <span className="sr-only">(demo record)</span>}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {txTypeMeta[tx.type].label}
                              {tx.note && ` · ${tx.note}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {formatDate(tx.timestamp)}
                        <span className="block text-xs">{formatTime(tx.timestamp)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-4 py-3">
                        <TxHash hash={tx.hash} status={tx.status} isDemo={tx.source === 'demo'} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <TxAmount tx={tx} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y md:hidden">
              {filtered.map((tx) => (
                <li key={tx.id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-center gap-3">
                    <TxTypeIcon type={tx.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{tx.counterparty}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {formatDate(tx.timestamp)}, {formatTime(tx.timestamp)}
                        {tx.note && ` · ${tx.note}`}
                      </p>
                    </div>
                    <TxAmount tx={tx} className="text-sm" />
                  </div>
                  <div className="flex items-center justify-between pl-12">
                    <StatusBadge status={tx.status} />
                    <TxHash hash={tx.hash} status={tx.status} isDemo={tx.source === 'demo'} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="border-t px-4 py-3 text-xs text-muted-foreground">
          Showing {filtered.length} of {all.length}. Demo records are sample data; explorer links are available only for
          confirmed on-chain transactions.
        </p>
      </section>
    </>
  )
}
