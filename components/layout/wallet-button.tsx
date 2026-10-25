'use client'

import { AlertTriangle, Loader2, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CampusCatMark } from '@/components/brand/campus-cat'
import { useWallet } from '@/hooks/use-wallet'
import { shortenAddress } from '@/lib/format'
import { cn } from '@/lib/utils'

export function WalletButton({ className }: { className?: string }) {
  const { status, address, isCorrectNetwork, connect, switchNetwork } = useWallet()

  if (status === 'connected' && address && !isCorrectNetwork) {
    return (
      <Button
        onClick={switchNetwork}
        className={cn('h-9 rounded-full bg-warning/15 px-3.5 text-warning hover:bg-warning/25', className)}
      >
        <AlertTriangle aria-hidden />
        <span>Switch network</span>
      </Button>
    )
  }

  if (status === 'connected' && address) {
    return (
      <div
        className={cn('inline-flex h-9 items-center gap-2 rounded-full border bg-card pr-3.5 pl-1 text-sm', className)}
      >
        <span className="relative">
          <CampusCatMark size="sm" className="size-7" />
          <span aria-hidden className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-success ring-2 ring-card" />
        </span>
        <span className="sr-only">Connected wallet:</span>
        <span className="font-mono">{shortenAddress(address)}</span>
      </div>
    )
  }

  return (
    <Button
      onClick={connect}
      disabled={status === 'connecting'}
      className={cn('h-9 rounded-full px-4', className)}
    >
      {status === 'connecting' ? <Loader2 className="animate-spin" aria-hidden /> : <Wallet aria-hidden />}
      <span>{status === 'connecting' ? 'Connecting…' : 'Connect Wallet'}</span>
    </Button>
  )
}
