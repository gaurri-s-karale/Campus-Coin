import Image from 'next/image'
import { cn } from '@/lib/utils'

const sizes = {
  sm: { box: 'size-6', px: 24 },
  md: { box: 'size-8', px: 32 },
  lg: { box: 'size-12', px: 48 },
} as const

export function CampusCatMark({
  size = 'md',
  className,
  label,
}: {
  size?: keyof typeof sizes
  className?: string
  label?: string
}) {
  const { box, px } = sizes[size]
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-border',
        box,
        className,
      )}
      aria-hidden={label ? undefined : true}
    >
      <Image
        src="/campuscat.png"
        alt={label ?? ''}
        width={px}
        height={px}
        className="size-[86%] object-contain"
        priority={size !== 'sm'}
      />
    </span>
  )
}
