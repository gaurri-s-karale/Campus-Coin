'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { findNavItem } from '@/lib/navigation'
import { appConfig } from '@/lib/config'
import { useWallet } from '@/hooks/use-wallet'
import { cn } from '@/lib/utils'
import { CampusCatMark } from '@/components/brand/campus-cat'
import { WalletButton } from './wallet-button'
import { ProfileMenu } from './profile-menu'

function NetworkBadge() {
  const { status, isCorrectNetwork } = useWallet()
  const mismatch = status === 'connected' && !isCorrectNetwork
  return (
    <span
      className={cn(
        'hidden h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium md:inline-flex',
        mismatch ? 'border-warning/40 bg-warning/10 text-warning' : 'bg-card text-foreground',
      )}
    >
      <span aria-hidden className={cn('size-2 rounded-full', mismatch ? 'bg-warning' : 'bg-success')} />
      {mismatch ? 'Wrong network' : appConfig.chainName}
    </span>
  )
}

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname()
  const current = findNavItem(pathname)

  return (
    <header className="sticky top-0 z-20 border-b bg-card">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="-ml-1 rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
          <span className="sr-only">Open navigation</span>
        </button>
        <Link href="/" className="rounded-full lg:hidden">
          <CampusCatMark size="md" label="CampusCoin home" />
        </Link>

        <h1 className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight">{current.label}</h1>

        <div className="flex items-center gap-2">
          <NetworkBadge />
          <WalletButton className="hidden sm:inline-flex" />
          <ProfileMenu />
        </div>
      </div>
      <div className="border-t px-4 py-2 sm:hidden">
        <WalletButton className="w-full justify-center" />
      </div>
    </header>
  )
}
