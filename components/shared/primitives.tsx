'use client'

import { Check, Copy, ExternalLink, FlaskConical, type LucideIcon } from 'lucide-react'
import { useCopy } from '@/hooks/use-copy'
import { explorerAddressUrl, explorerTxUrl } from '@/lib/config'
import { shortenAddress } from '@/lib/format'
import type { TransactionStatus } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function CopyButton({
  value,
  label,
  successMessage,
  className,
}: {
  value: string
  label: string
  successMessage?: string
  className?: string
}) {
  const { copied, copy } = useCopy()
  return (
    <button
      type="button"
      onClick={() => copy(value, successMessage)}
      className={cn(
        'inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        className,
      )}
    >
      {copied ? <Check className="size-3.5 text-success" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      <span className="sr-only">{label}</span>
    </button>
  )
}

export function AddressDisplay({
  address,
  chars = 4,
  explorer = false,
  className,
}: {
  address: string
  chars?: number
  explorer?: boolean
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-0.5 font-mono text-xs', className)}>
      <span title={address}>{shortenAddress(address, chars)}</span>
      <CopyButton value={address} label="Copy address" successMessage="Address copied" />
      {explorer && (
        <a
          href={explorerAddressUrl(address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          <span className="sr-only">View address on explorer</span>
        </a>
      )}
    </span>
  )
}

export function TxHash({ hash, status, isDemo }: { hash: string; status: TransactionStatus; isDemo: boolean }) {
  const canLink = status === 'confirmed' && !isDemo
  return (
    <span className="inline-flex items-center gap-0.5 font-mono text-xs text-muted-foreground">
      <span title={hash}>{shortenAddress(hash, 5)}</span>
      <CopyButton value={hash} label="Copy transaction hash" successMessage="Transaction hash copied" />
      {canLink ? (
        <a
          href={explorerTxUrl(hash)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          <span className="sr-only">View transaction on Etherscan</span>
        </a>
      ) : (
        <span
          className="inline-flex size-7 items-center justify-center opacity-30"
          title={isDemo ? 'Demo record — not on-chain' : 'Explorer link available once confirmed'}
        >
          <ExternalLink className="size-3.5" aria-hidden />
        </span>
      )}
    </span>
  )
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const map = {
    confirmed: { variant: 'success', label: 'Confirmed' },
    pending: { variant: 'warning', label: 'Pending' },
    failed: { variant: 'destructive', label: 'Failed' },
  } as const
  const { variant, label } = map[status]
  return (
    <Badge variant={variant}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  )
}

export function DemoBadge({ className, label = 'Demo data' }: { className?: string; label?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('border-dashed', className)}
      title="Sample data for development. Not recorded on any blockchain."
    >
      <FlaskConical aria-hidden />
      {label}
    </Badge>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center">
      <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'default',
}: {
  label: string
  value: string
  hint?: React.ReactNode
  icon: LucideIcon
  tone?: 'default' | 'success' | 'warning'
}) {
  const toneClass = {
    default: 'bg-secondary text-secondary-foreground',
    success: 'bg-success/12 text-success',
    warning: 'bg-warning/15 text-[oklch(0.5_0.12_65)]',
  }[tone]
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className={cn('grid size-8 place-items-center rounded-lg', toneClass)}>
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}

export function PageIntro({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-balance">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground text-pretty">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
