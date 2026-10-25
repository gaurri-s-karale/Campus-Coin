import { CalendarDays, Coffee, PenTool, Printer, type LucideIcon } from 'lucide-react'
import type { VendorCategory } from './types'

export const categoryMeta: Record<
  VendorCategory,
  { label: string; icon: LucideIcon; description: string; tint: string }
> = {
  canteen: {
    label: 'Canteen',
    icon: Coffee,
    description: 'Meals, snacks & drinks',
    tint: 'bg-[oklch(0.95_0.05_60)] text-[oklch(0.5_0.13_55)]',
  },
  stationery: {
    label: 'Stationery',
    icon: PenTool,
    description: 'Notebooks, kits & supplies',
    tint: 'bg-[oklch(0.95_0.04_230)] text-[oklch(0.48_0.13_240)]',
  },
  printing: {
    label: 'Printing',
    icon: Printer,
    description: 'Prints, binding & posters',
    tint: 'bg-[oklch(0.95_0.04_165)] text-[oklch(0.48_0.11_165)]',
  },
  events: {
    label: 'Events',
    icon: CalendarDays,
    description: 'Fest passes & workshops',
    tint: 'bg-secondary text-secondary-foreground',
  },
}

export const categoryOrder: VendorCategory[] = ['canteen', 'stationery', 'printing', 'events']
