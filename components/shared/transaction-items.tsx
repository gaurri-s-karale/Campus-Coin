import { ArrowDownLeft, ArrowUpRight, Gift, ShoppingBag } from 'lucide-react'
import type { Transaction, TransactionType } from '@/lib/types'
import { formatCC, formatDate, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import { StatusBadge } from './primitives'

export const txTypeMeta: Record<
  TransactionType,
  { label: string; icon: typeof ArrowUpRight; tint: string; sign: '+' | '-' }
> = {
  sent: { label: 'Sent', icon: ArrowUpRight, tint: 'bg-muted text-foreground/70', sign: '-' },
  received: { label: 'Received', icon: ArrowDownLeft, tint: 'bg-info/10 text-info', sign: '+' },
  payment: { label: 'Payment', icon: ShoppingBag, tint: 'bg-secondary text-secondary-foreground', sign: '-' },
  reward: { label: 'Reward', icon: Gift, tint: 'bg-warning/15 text-[oklch(0.5_0.12_65)]', sign: '+' },
}

export function TxTypeIcon({ type, className }: { type: TransactionType; className?: string }) {
  const meta = txTypeMeta[type]
  const Icon = meta.icon
  return (
    <span className={cn('grid size-9 shrink-0 place-items-center rounded-full', meta.tint, className)}>
      <Icon className="size-4" aria-hidden />
    </span>
  )
}

export function TxAmount({ tx, className }: { tx: Transaction; className?: string }) {
  const { sign } = txTypeMeta[tx.type]
  return (
    <span
      className={cn(
        'font-semibold tabular-nums',
        sign === '+' ? 'text-success' : 'text-foreground',
        tx.status === 'failed' && 'text-muted-foreground line-through',
        className,
      )}
    >
      {sign}
      {formatCC(tx.amount)}
    </span>
  )
}

export function RecentTransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <ul className="divide-y">
      {transactions.map((tx) => (
        <li key={tx.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <TxTypeIcon type={tx.type} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{tx.counterparty}</p>
            <p className="truncate text-xs text-muted-foreground">
              {txTypeMeta[tx.type].label} · {formatDate(tx.timestamp)}, {formatTime(tx.timestamp)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <TxAmount tx={tx} className="text-sm" />
            <StatusBadge status={tx.status} />
          </div>
        </li>
      ))}
    </ul>
  )
}
