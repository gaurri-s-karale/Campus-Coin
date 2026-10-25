'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, LogOut, Settings, ShieldCheck, Store, User } from 'lucide-react'
import { demoStudent } from '@/lib/demo-data'
import { useWallet } from '@/hooks/use-wallet'

export function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { status, disconnect } = useWallet()

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const items = [
    { href: '/settings', label: 'Profile & settings', icon: Settings },
    { href: '/vendor', label: 'Vendor dashboard', icon: Store },
    { href: '/admin', label: 'Admin console', icon: ShieldCheck },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-secondary text-xs font-semibold text-secondary-foreground">
          {demoStudent.initials}
        </span>
        <span className="hidden text-left leading-tight xl:block">
          <span className="block text-sm font-medium">{demoStudent.name}</span>
          <span className="block text-xs text-muted-foreground">{demoStudent.studentId}</span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
        <span className="sr-only">Open profile menu</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 rounded-xl border bg-popover p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95"
        >
          <div className="flex items-center gap-3 px-2.5 py-2">
            <User className="size-4 text-muted-foreground" aria-hidden />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{demoStudent.name}</p>
              <p className="truncate text-xs text-muted-foreground">{demoStudent.email}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-border" />
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-muted"
            >
              <item.icon className="size-4 text-muted-foreground" aria-hidden />
              {item.label}
            </Link>
          ))}
          {status === 'connected' && (
            <>
              <div className="my-1 h-px bg-border" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  disconnect()
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4" aria-hidden />
                Disconnect wallet
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
