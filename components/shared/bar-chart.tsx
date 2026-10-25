import type { ChartPoint } from '@/lib/types'
import { formatCC } from '@/lib/format'
import { cn } from '@/lib/utils'

export function BarChart({
  data,
  label,
  highlightLast = true,
  height = 'h-36',
}: {
  data: ChartPoint[]
  label: string
  highlightLast?: boolean
  height?: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <figure aria-label={label}>
      <div className={cn('flex items-end gap-2', height)} role="list">
        {data.map((point, i) => {
          const pct = Math.max((point.value / max) * 100, point.value > 0 ? 6 : 2)
          const highlighted = highlightLast && i === data.length - 1
          return (
            <div key={point.label} role="listitem" className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="pointer-events-none text-[10px] font-medium text-muted-foreground opacity-0 transition-opacity tabular-nums group-hover:opacity-100">
                {point.value}
              </span>
              <div
                className={cn(
                  'w-full max-w-9 rounded-md transition-colors',
                  highlighted
                    ? 'bg-primary'
                    : 'bg-secondary group-hover:bg-primary/40',
                )}
                style={{ height: `${pct}%` }}
              >
                <span className="sr-only">
                  {point.label}: {formatCC(point.value)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-2" aria-hidden>
        {data.map((point) => (
          <span key={point.label} className="flex-1 text-center text-[11px] text-muted-foreground">
            {point.label}
          </span>
        ))}
      </div>
    </figure>
  )
}
