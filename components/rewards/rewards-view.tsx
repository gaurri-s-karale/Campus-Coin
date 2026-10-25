import { BookOpen, CalendarDays, Gift, HeartHandshake, Leaf, Target, Trophy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoBadge, StatCard } from '@/components/shared/primitives'
import { demoRewardActivities, demoRewardChallenges } from '@/lib/demo-data'
import { formatCC, formatDate } from '@/lib/format'
import type { RewardActivity } from '@/lib/types'

const activityIcon: Record<RewardActivity['category'], typeof Gift> = {
  academic: BookOpen,
  events: CalendarDays,
  sustainability: Leaf,
  community: HeartHandshake,
}

const waysToEarn = [
  { title: 'Attend workshops', amount: '20–50 CC', icon: CalendarDays },
  { title: 'Volunteer drives', amount: '50–100 CC', icon: HeartHandshake },
  { title: 'Library streaks', amount: '15–30 CC', icon: BookOpen },
  { title: 'Green commuting', amount: '2 CC / ride', icon: Leaf },
]

export function RewardsView() {
  const earned = demoRewardActivities.reduce((s, r) => s + r.amount, 0)
  const potential = demoRewardChallenges.reduce((s, c) => s + c.reward, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Earned this semester" value={formatCC(earned)} icon={Trophy} tone="warning" hint={<DemoBadge />} />
        <StatCard label="Activities completed" value={String(demoRewardActivities.length)} icon={Gift} />
        <StatCard label="Up for grabs" value={formatCC(potential)} icon={Target} tone="success" hint="From active challenges" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Reward history</CardTitle>
              <CardDescription>CC credited by the CampusCoin rewards wallet</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="relative flex flex-col gap-5 border-l pl-6">
              {demoRewardActivities.map((r) => {
                const Icon = activityIcon[r.category]
                return (
                  <li key={r.id} className="relative">
                    <span className="absolute top-0 -left-[38px] grid size-7 place-items-center rounded-full border-4 border-card bg-warning/20 text-[oklch(0.5_0.12_65)]">
                      <Icon className="size-3" aria-hidden />
                    </span>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDate(r.date)}</p>
                      </div>
                      <span className="text-sm font-semibold text-success tabular-nums">+{r.amount} CC</span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Active challenges</CardTitle>
                <CardDescription>Complete to unlock bonus CC</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-5">
                {demoRewardChallenges.map((c) => {
                  const pct = Math.round((c.progress / c.goal) * 100)
                  return (
                    <li key={c.id}>
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-medium">{c.title}</p>
                        <span className="text-xs font-semibold text-primary">+{c.reward} CC</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                      <div
                        className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-label={`${c.title} progress`}
                        aria-valuenow={c.progress}
                        aria-valuemin={0}
                        aria-valuemax={c.goal}
                      >
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="mt-1 text-right text-[11px] text-muted-foreground tabular-nums">
                        {c.progress}/{c.goal}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ways to earn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 gap-3">
                {waysToEarn.map((w) => (
                  <li key={w.title} className="rounded-xl bg-muted/60 p-3">
                    <w.icon className="size-4 text-primary" aria-hidden />
                    <p className="mt-2 text-sm font-medium">{w.title}</p>
                    <p className="text-xs text-muted-foreground">{w.amount}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
