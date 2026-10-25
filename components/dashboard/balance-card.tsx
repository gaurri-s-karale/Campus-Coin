'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowDownLeft, ArrowUpRight, History, Loader2, RefreshCw, ScanLine, type LucideIcon } from 'lucide-react'
import { useWallet } from '@/hooks/use-wallet'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { demoStudent } from '@/lib/demo-data'
import { appConfig } from '@/lib/config'
import { formatNumber, shortenAddress } from '@/lib/format'
import { CopyButton } from '@/components/shared/primitives'
import { ReceiveModal } from '@/components/shared/receive-modal'
import { CampusCatMark } from '@/components/brand/campus-cat'
import { ActivityPanel, TokenList } from './overview-sections'
import { cn } from '@/lib/utils'

const actionClass =
  'group flex w-16 flex-col items-center gap-1.5 text-xs font-medium text-foreground outline-none'
const actionIconClass =
  'grid size-10 place-items-center rounded-full bg-primary text-primary-foreground transition-colors group-hover:bg-primary-hover group-focus-visible:ring-3 group-focus-visible:ring-ring/40'

function ActionContent({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <>
      <span className={actionIconClass}>
        <Icon className="size-[18px]" aria-hidden />
      </span>
      {label}
    </>
  )
}

type Tab = 'tokens' | 'activity'

export function BalanceCard() {
  const { address } = useWallet()
  const { balance, isDemo, isLoading, error, refresh, isCorrectNetwork } = useTokenBalance()
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('tokens')
  const displayAddress = address ?? demoStudent.address

  return (
    <section aria-labelledby="balance-heading" className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <CampusCatMark size="md" />
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-semibold">{address ? 'Campus Account' : 'Demo Account'}</p>
            <p className="flex items-center font-mono text-xs text-muted-foreground" title={displayAddress}>
              {shortenAddress(displayAddress, 5)}
              <CopyButton
                value={displayAddress}
                label="Copy wallet address"
                successMessage="Wallet address copied"
                className="-my-1 size-6"
              />
            </p>
          </div>
        </div>
        {isDemo ? (
          <span className="rounded-full border border-dashed px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            Demo balance
          </span>
        ) : (
          <button
            type="button"
            onClick={() => refresh()}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className={cn('size-3', isLoading && 'animate-spin')} aria-hidden /> Refresh
          </button>
        )}
      </div>

      <div className="flex flex-col items-center px-4 pt-6 pb-5 text-center">
        <h2 id="balance-heading" className="sr-only">
          {appConfig.tokenName} balance
        </h2>
        <div className="flex h-11 items-baseline gap-1.5" aria-live="polite">
          {isLoading ? (
            <Loader2 className="size-7 animate-spin self-center text-primary" aria-label="Loading balance" />
          ) : (
            <>
              <span className="text-4xl font-semibold tracking-tight tabular-nums">
                {balance === null ? '—' : formatNumber(balance)}
              </span>
              <span className="text-lg font-medium text-muted-foreground">{appConfig.tokenSymbol}</span>
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {error ? (
            <span className="text-destructive">{error.message || 'Could not read balance from the contract.'}</span>
          ) : address && !isCorrectNetwork ? (
            <span className="text-warning">Switch to {appConfig.chainName} to view your live balance.</span>
          ) : address && balance === null ? (
            <span>Connect to {appConfig.chainName} to load your balance.</span>
          ) : (
            `${appConfig.tokenName} on ${appConfig.chainName}`
          )}
        </p>

        <div className="mt-5 flex justify-center gap-3 sm:gap-5">
          <Link href="/send" className={actionClass}>
            <ActionContent icon={ArrowUpRight} label="Send" />
          </Link>
          <button type="button" onClick={() => setReceiveOpen(true)} className={actionClass}>
            <ActionContent icon={ArrowDownLeft} label="Receive" />
          </button>
          <Link href="/qr" className={actionClass}>
            <ActionContent icon={ScanLine} label="Scan" />
          </Link>
          <Link href="/transactions" className={actionClass}>
            <ActionContent icon={History} label="History" />
          </Link>
        </div>
      </div>

      <div role="tablist" aria-label="Wallet" className="flex border-b">
        {(['tokens', 'activity'] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            onClick={() => setTab(key)}
            className={cn(
              '-mb-px flex-1 border-b-2 py-2.5 text-sm font-medium capitalize transition-colors',
              tab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {key}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'tokens' ? <TokenList ccBalance={balance} ccLoading={isLoading} /> : <ActivityPanel />}
      </div>

      <ReceiveModal
        open={receiveOpen}
        onClose={() => setReceiveOpen(false)}
        address={displayAddress}
        isDemo={!address}
      />
    </section>
  )
}
