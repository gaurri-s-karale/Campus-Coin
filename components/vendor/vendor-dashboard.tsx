'use client'

import { useId, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Coins, Copy, Receipt, ShoppingBag, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldError, FieldHint, Input, Label } from '@/components/ui/field'
import { BarChart } from '@/components/shared/bar-chart'
import { DemoBadge, StatCard, StatusBadge } from '@/components/shared/primitives'
import { TxAmount } from '@/components/shared/transaction-items'
import { useCopy } from '@/hooks/use-copy'
import { useWallet } from '@/hooks/use-wallet'
import { demoVendorHourlySales, demoVendorProfile, demoVendorReceipts } from '@/lib/demo-data'
import { formatCC, formatNumber, formatTime } from '@/lib/format'
import { encodePaymentRequest, validateAmount } from '@/lib/payment-request'

function PaymentRequestGenerator() {
  const ids = { amount: useId(), ref: useId(), amountErr: useId() }
  const { address } = useWallet()
  const vendor = demoVendorProfile.vendor
  const payTo = address ?? vendor.address
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')
  const [request, setRequest] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const { copy, copied } = useCopy()
  const amountError = validateAmount(amount)

  const generate = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (amountError) return
    setRequest(
      encodePaymentRequest({
        to: payTo,
        amount: amount.trim(),
        vendor: vendor.name,
        reference: reference.trim() || undefined,
      }),
    )
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Request a payment</CardTitle>
          <CardDescription>Generate a QR code for the student to scan at your counter.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <form noValidate onSubmit={generate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={ids.amount}>Amount (CC)</Label>
            <Input
              id={ids.amount}
              value={amount}
              inputMode="decimal"
              onChange={(e) => {
                setAmount(e.target.value.replace(/[^\d.]/g, ''))
                setRequest(null)
              }}
              placeholder="45"
              className="text-lg font-semibold tabular-nums"
              aria-invalid={touched && Boolean(amountError)}
              aria-describedby={ids.amountErr}
            />
            <FieldError id={ids.amountErr}>{touched ? amountError : null}</FieldError>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={ids.ref}>
              Order reference <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id={ids.ref}
              value={reference}
              maxLength={24}
              onChange={(e) => {
                setReference(e.target.value)
                setRequest(null)
              }}
              placeholder="ORD-1042"
            />
          </div>
          <FieldHint>
            Payments go to {address ? 'your connected wallet' : `${vendor.name}'s demo wallet`}.
          </FieldHint>
          <Button type="submit" className="h-11 rounded-xl">
            Generate QR
          </Button>
        </form>

        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-5">
          {request ? (
            <>
              <div className="rounded-xl bg-white p-3">
                <QRCodeSVG value={request} size={168} level="M" aria-label={`Payment QR for ${amount} CC`} role="img" />
              </div>
              <p className="text-2xl font-semibold tabular-nums">{formatCC(amount)}</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => copy(request, 'Payment request copied')}
              >
                <Copy aria-hidden /> {copied ? 'Copied' : 'Copy request text'}
              </Button>
            </>
          ) : (
            <p className="max-w-48 text-center text-sm text-muted-foreground">
              Enter an amount to generate a scannable payment QR.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function VendorDashboard() {
  const p = demoVendorProfile
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-5 py-4">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{p.vendor.name}</p>
          <p className="text-sm text-muted-foreground">
            {p.vendor.location} · {p.vendor.hours}
          </p>
        </div>
        <DemoBadge label="Demo vendor account" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Settlement balance" value={formatCC(p.balance)} icon={Coins} />
        <StatCard label="Today's sales" value={formatCC(p.todaySales)} icon={TrendingUp} tone="success" />
        <StatCard label="Orders today" value={formatNumber(p.todayOrders)} icon={ShoppingBag} />
        <StatCard label="Average order" value={formatCC(p.avgOrder)} icon={Receipt} tone="warning" />
      </div>

      <PaymentRequestGenerator />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Sales by hour</CardTitle>
              <CardDescription>Today, in CC</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart data={demoVendorHourlySales} label="Hourly sales today" highlightLast={false} height="h-44" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Recent receipts</CardTitle>
              <CardDescription>Incoming CampusCoin payments</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {demoVendorReceipts.map((tx) => (
                <li key={tx.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    {tx.counterparty
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{tx.counterparty}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formatTime(tx.timestamp)} · {tx.note}
                    </p>
                  </div>
                  <StatusBadge status={tx.status} />
                  <TxAmount tx={tx} className="w-20 text-right text-sm" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
