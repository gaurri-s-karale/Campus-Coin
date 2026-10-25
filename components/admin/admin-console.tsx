'use client'

import { useId, useState } from 'react'
import useSWR from 'swr'
import { Check, Coins, Gift, Store, Users, X, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldError, Input, Label } from '@/components/ui/field'
import { AddressDisplay, DemoBadge, StatCard, StatusBadge } from '@/components/shared/primitives'
import { TxAmount, TxTypeIcon } from '@/components/shared/transaction-items'
import { TransferConfirmModal, type TransferDetails } from '@/components/shared/transfer-confirm-modal'
import { categoryMeta } from '@/lib/categories'
import { isContractConfigured } from '@/lib/config'
import { demoAdminActivity, demoAdminStats, demoVendors, pendingVendors } from '@/lib/demo-data'
import { formatCC, formatDate, formatNumber } from '@/lib/format'
import { validateAmount, validateRecipient } from '@/lib/payment-request'
import { getTotalSupply } from '@/services/blockchain-service'
import type { Vendor } from '@/lib/types'

function SupplyCard() {
  const { data: liveSupply } = useSWR(isContractConfigured ? 'cc-total-supply' : null, getTotalSupply)
  const total = liveSupply ?? demoAdminStats.totalSupply
  const pct = Math.min(100, Math.round((demoAdminStats.circulating / demoAdminStats.totalSupply) * 100))
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Token supply</CardTitle>
          <CardDescription>
            {liveSupply !== undefined ? 'Total supply read live from the contract' : 'Sample figures'}
          </CardDescription>
        </div>
        {liveSupply === undefined && <DemoBadge />}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums">{formatCC(total)}</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-primary" aria-hidden /> In circulation
            </dt>
            <dd className="font-medium tabular-nums">{formatCC(demoAdminStats.circulating)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-muted-foreground/40" aria-hidden /> Treasury reserve
            </dt>
            <dd className="font-medium tabular-nums">
              {formatCC(demoAdminStats.totalSupply - demoAdminStats.circulating)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

function DistributeForm() {
  const ids = { to: useId(), amount: useId(), reason: useId(), toErr: useId(), amountErr: useId() }
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [details, setDetails] = useState<TransferDetails | null>(null)
  const toError = validateRecipient(to)
  const amountError = validateAmount(amount)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (toError || amountError) return
    setDetails({
      to: to.trim(),
      amount: amount.trim(),
      label: 'Reward recipient',
      note: reason.trim() || 'Campus reward',
      type: 'reward',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Distribute rewards</CardTitle>
          <CardDescription>Send CC from the connected treasury wallet to a student.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={ids.to}>Student wallet</Label>
            <Input
              id={ids.to}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="0x…"
              className="font-mono"
              spellCheck={false}
              aria-invalid={submitted && Boolean(toError)}
              aria-describedby={ids.toErr}
            />
            <FieldError id={ids.toErr}>{submitted ? toError : null}</FieldError>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={ids.amount}>Amount (CC)</Label>
              <Input
                id={ids.amount}
                value={amount}
                inputMode="decimal"
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                placeholder="50"
                aria-invalid={submitted && Boolean(amountError)}
                aria-describedby={ids.amountErr}
              />
              <FieldError id={ids.amountErr}>{submitted ? amountError : null}</FieldError>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={ids.reason}>Reason</Label>
              <Input
                id={ids.reason}
                value={reason}
                maxLength={60}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Hackathon winner"
              />
            </div>
          </div>
          <Button type="submit" className="h-11 rounded-xl">
            <Gift aria-hidden /> Review reward
          </Button>
        </form>
      </CardContent>
      <TransferConfirmModal
        open={details !== null}
        details={details}
        title="Confirm reward distribution"
        onClose={() => setDetails(null)}
        onConfirmed={() => {
          setTo('')
          setAmount('')
          setReason('')
          setSubmitted(false)
        }}
      />
    </Card>
  )
}

function VendorRegistry() {
  const [pending, setPending] = useState<Vendor[]>(pendingVendors)
  const [approved, setApproved] = useState<Vendor[]>([])
  const active = [...approved, ...demoVendors]

  const approve = (v: Vendor) => {
    setPending((p) => p.filter((x) => x.id !== v.id))
    setApproved((a) => [{ ...v, status: 'active' }, ...a])
  }
  const reject = (v: Vendor) => setPending((p) => p.filter((x) => x.id !== v.id))

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Vendor registry</CardTitle>
          <CardDescription>Approve campus merchants to accept CampusCoin</CardDescription>
        </div>
        <DemoBadge label="Not persisted" />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {pending.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Pending approval ({pending.length})
            </h3>
            <ul className="flex flex-col gap-2">
              {pending.map((v) => (
                <li key={v.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-warning/40 bg-warning/5 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {categoryMeta[v.category].label} · {v.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-lg" onClick={() => reject(v)} aria-label={`Reject ${v.name}`}>
                      <X aria-hidden /> Reject
                    </Button>
                    <Button size="sm" className="rounded-lg" onClick={() => approve(v)} aria-label={`Approve ${v.name}`}>
                      <Check aria-hidden /> Approve
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-medium">Vendor</th>
                <th scope="col" className="py-2 pr-4 font-medium">Category</th>
                <th scope="col" className="py-2 pr-4 font-medium">Wallet</th>
                <th scope="col" className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {active.map((v) => (
                <tr key={v.id}>
                  <td className="py-2.5 pr-4 font-medium whitespace-nowrap">{v.name}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{categoryMeta[v.category].label}</td>
                  <td className="py-2.5 pr-4">
                    <AddressDisplay address={v.address} />
                  </td>
                  <td className="py-2.5">
                    <Badge variant="success">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function AdminConsole() {
  const s = demoAdminStats
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered wallets" value={formatNumber(s.registeredWallets)} icon={Users} hint={<DemoBadge />} />
        <StatCard label="Active vendors" value={String(s.activeVendors)} icon={Store} tone="success" />
        <StatCard label="Pending vendors" value={String(s.pendingVendors)} icon={Store} tone="warning" />
        <StatCard label="Transactions (24h)" value={formatNumber(s.txLast24h)} icon={Zap} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SupplyCard />
        <DistributeForm />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <VendorRegistry />
        </div>
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Treasury activity</CardTitle>
              <CardDescription>Grants, rewards and settlements</CardDescription>
            </div>
            <Coins className="size-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {demoAdminActivity.map((tx) => (
                <li key={tx.id} className="flex items-center gap-3 py-3">
                  <TxTypeIcon type={tx.type} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{tx.counterparty}</p>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      {formatDate(tx.timestamp)} <StatusBadge status={tx.status} />
                    </p>
                  </div>
                  <TxAmount tx={tx} className="text-sm" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
