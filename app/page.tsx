import { BalanceCard } from '@/components/dashboard/balance-card'
import { CampusCatNote } from '@/components/dashboard/overview-sections'

export default function OverviewPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
      <BalanceCard />
      <CampusCatNote />
    </div>
  )
}
