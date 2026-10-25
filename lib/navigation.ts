import {
  ArrowLeftRight,
  Gift,
  LayoutDashboard,
  QrCode,
  Send,
  Settings,
  ShieldCheck,
  Store,
  Wallet,
  type LucideIcon,
  BadgeIndianRupee,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  description: string
}

export const studentNav: NavItem[] = [
  { href: '/', label: 'Overview', icon: LayoutDashboard, description: 'Your CampusCoin at a glance' },
  { href: '/wallet', label: 'My Wallet', icon: Wallet, description: 'Wallet connection and token details' },
  { href: '/send', label: 'Send Tokens', icon: Send, description: 'Transfer CC to any campus wallet' },
  { href: '/marketplace', label: 'Campus Marketplace', icon: Store, description: 'Pay registered campus vendors' },
  { href: '/qr', label: 'QR Payments', icon: QrCode, description: 'Scan a vendor payment request' },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight, description: 'Your complete payment history' },
  { href: '/rewards', label: 'Rewards', icon: Gift, description: 'Earn CC for campus activities' },
  { href: '/settings', label: 'Settings', icon: Settings, description: 'Profile, network and preferences' },
]

export const portalNav: NavItem[] = [
  { href: '/vendor', label: 'Vendor Dashboard', icon: BadgeIndianRupee, description: 'Accept CC payments at your counter' },
  { href: '/admin', label: 'Admin Console', icon: ShieldCheck, description: 'Token supply and vendor registry' },
]

const allNav = [...studentNav, ...portalNav]

export function findNavItem(pathname: string) {
  if (pathname === '/') return studentNav[0]
  return allNav.find((item) => item.href !== '/' && pathname.startsWith(item.href)) ?? studentNav[0]
}
