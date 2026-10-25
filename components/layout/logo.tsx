import Link from 'next/link'
import { CampusCatMark } from '@/components/brand/campus-cat'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <CampusCatMark size="md" />
      <span className="text-[15px] font-semibold tracking-tight text-foreground">CampusCoin</span>
    </Link>
  )
}
