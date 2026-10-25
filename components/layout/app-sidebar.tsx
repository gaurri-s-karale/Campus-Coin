'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { portalNav, studentNav, type NavItem } from '@/lib/navigation'
import { isContractConfigured } from '@/lib/config'
import { Logo } from './logo'

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname()
  const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-muted',
      )}
    >
      {active && <span aria-hidden className="absolute inset-y-1.5 -left-3 w-1 rounded-r bg-sidebar-primary" />}
      <Icon
        aria-hidden
        className={cn('size-[18px]', active ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-foreground')}
      />
      {item.label}
    </Link>
  )
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-5">
        <Logo />
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pt-3">
        <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-sidebar-muted uppercase">Student</p>
        <ul className="flex flex-col gap-0.5">
          {studentNav.map((item) => (
            <li key={item.href}>
              <NavLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
        <p className="mt-6 px-3 pb-2 text-[11px] font-semibold tracking-wider text-sidebar-muted uppercase">Portals</p>
        <ul className="flex flex-col gap-0.5">
          {portalNav.map((item) => (
            <li key={item.href}>
              <NavLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <FlaskConical className="size-3.5 text-sidebar-primary" aria-hidden />
          {isContractConfigured ? 'Contract connected' : 'Demo mode'}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-sidebar-muted">
          {isContractConfigured
            ? 'Balances and transfers use the CampusCoin ERC-20 contract on Sepolia.'
            : 'Sample data is shown. Set the contract address to enable on-chain transfers.'}
        </p>
      </div>
    </div>
  )
}

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-sidebar-border bg-sidebar lg:block">
      <SidebarContent />
    </aside>
  )
}
