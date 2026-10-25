'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { CampusCatMark } from '@/components/brand/campus-cat'
import { DemoBadge } from '@/components/shared/primitives'
import { RecentTransactionList } from '@/components/shared/transaction-items'
import { useSessionTransactions } from '@/hooks/use-session-transactions'
import { useNativeBalance } from '@/hooks/use-native-balance'
import { useWallet } from '@/hooks/use-wallet'
import { appConfig } from '@/lib/config'
import { demoRewardChallenges, demoTransactions } from '@/lib/demo-data'
import { formatNumber } from '@/lib/format'

function TokenRow({
  icon,
  name,
  network,
  amount,
  symbol,
}: {
  icon: React.ReactNode
  name: string
  network: string
  amount: string
  symbol: string
}) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      {icon}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{network}</p>
      </div>
      <p className="text-right text-sm font-medium tabular-nums">
        {amount} <span className="text-muted-foreground">{symbol}</span>
      </p>
    </li>
  )
}

export function TokenList({ ccBalance, ccLoading }: { ccBalance: number | null; ccLoading: boolean }) {
  const { address } = useWallet()
  const eth = useNativeBalance()

  return (
    <ul className="divide-y">
      <TokenRow
        icon={<CampusCatMark size="md" className="size-9" />}
        name={appConfig.tokenName}
        network={appConfig.chainName}
        amount={ccLoading ? '…' : ccBalance === null ? '—' : formatNumber(ccBalance)}
        symbol={appConfig.tokenSymbol}
      />
      <TokenRow
        icon={
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-info/10 text-xs font-semibold text-info">
            ETH
          </span>
        }
        name={appConfig.nativeCurrency.name}
        network={address ? 'Used for network fees' : 'Connect a wallet to view'}
        amount={!address ? '—' : eth.isLoading || eth.balance === null ? '…' : eth.balance.toFixed(4)}
        symbol={appConfig.nativeCurrency.symbol}
      />
    </ul>
  )
}

export function ActivityPanel() {
  const { transactions: session } = useSessionTransactions()
  const items = [...session, ...demoTransactions].slice(0, 5)
  return (
    <div className="px-4 py-3">
      {session.length === 0 && (
        <p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <DemoBadge /> Sample records. Your on-chain transfers appear here.
        </p>
      )}
      <RecentTransactionList transactions={items} />
      <Link
        href="/transactions"
        className="mt-3 flex items-center justify-center gap-1 border-t pt-3 text-sm font-medium text-primary hover:text-primary-hover"
      >
        View full history <ChevronRight className="size-4" aria-hidden />
      </Link>
    </div>
  )
}

export function CampusCatNote() {
  const open = demoRewardChallenges.length
  return (
    <Link
      href="/rewards"
      className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors hover:bg-muted/60"
    >
      <CampusCatMark size="lg" className="size-10" />
      <p className="min-w-0 flex-1 text-sm text-pretty">
        <span className="font-medium">CampusCat</span>
        <span className="text-muted-foreground">
          {' '}
          · {open} reward {open === 1 ? 'challenge is' : 'challenges are'} open this week. Earn {appConfig.tokenSymbol}{' '}
          for campus activities.
        </span>
      </p>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    </Link>
  )
}
