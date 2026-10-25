'use client'

import { useId, useState } from 'react'
import { ArrowRight, Fuel, Info, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldError, FieldHint, Input, Label, Textarea } from '@/components/ui/field'
import { TransferConfirmModal, type TransferDetails } from '@/components/shared/transfer-confirm-modal'
import { DemoBadge } from '@/components/shared/primitives'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { useWallet } from '@/hooks/use-wallet'
import { appConfig, isContractConfigured } from '@/lib/config'
import { formatCC, shortenAddress } from '@/lib/format'
import { validateAmount, validateRecipient } from '@/lib/payment-request'

const recentContacts = [
  { name: 'Priya Nair', address: '0x9f1b3d5a7c9e1f3b5d7a9c1e3f5b7d9a1c3e5f7b' },
  { name: 'Rohan Verma', address: '0x3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f' },
  { name: 'Ananya Iyer', address: '0x7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b5d' },
]

export function SendForm() {
  const ids = { to: useId(), amount: useId(), note: useId(), toErr: useId(), amountErr: useId() }
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [details, setDetails] = useState<TransferDetails | null>(null)
  const { balance, isDemo } = useTokenBalance()
  const { address } = useWallet()

  const toError =
    validateRecipient(to) ??
    (address && to.trim().toLowerCase() === address.toLowerCase() ? 'You cannot send tokens to your own wallet.' : null)
  const amountError = validateAmount(amount, balance ?? undefined)
  const showTo = submitted || to.length > 0 ? toError : null
  const showAmount = submitted || amount.length > 0 ? amountError : null

  const contact = recentContacts.find((c) => c.address.toLowerCase() === to.trim().toLowerCase())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (toError || amountError) return
    setDetails({
      to: to.trim(),
      amount: amount.trim(),
      label: contact?.name ?? shortenAddress(to.trim()),
      note: note.trim() || undefined,
      type: 'sent',
    })
  }

  const resetForm = () => {
    setDetails(null)
    setTo('')
    setAmount('')
    setNote('')
    setSubmitted(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div>
            <CardTitle>Transfer details</CardTitle>
            <CardDescription>Send {appConfig.tokenSymbol} to any wallet on {appConfig.chainName}.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor={ids.to}>Recipient wallet address</Label>
              <Input
                id={ids.to}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="0x…"
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
                aria-invalid={Boolean(showTo)}
                aria-describedby={ids.toErr}
              />
              <FieldError id={ids.toErr}>{showTo}</FieldError>
              <div className="flex flex-wrap gap-2">
                {recentContacts.map((c) => (
                  <button
                    key={c.address}
                    type="button"
                    onClick={() => setTo(c.address)}
                    className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs hover:border-primary/40 hover:bg-secondary"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
                      {c.name[0]}
                    </span>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={ids.amount}>Amount</Label>
                <span className="text-xs text-muted-foreground">
                  Available: {balance === null ? '—' : formatCC(balance)}
                  {isDemo && ' (demo)'}
                </span>
              </div>
              <div className="relative">
                <Input
                  id={ids.amount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="pr-24 text-lg font-semibold tabular-nums"
                  aria-invalid={Boolean(showAmount)}
                  aria-describedby={ids.amountErr}
                />
                <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                  {balance !== null && (
                    <button
                      type="button"
                      onClick={() => setAmount(String(balance))}
                      className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground"
                    >
                      Max
                    </button>
                  )}
                  <span className="px-1 text-sm font-medium text-muted-foreground">{appConfig.tokenSymbol}</span>
                </div>
              </div>
              <FieldError id={ids.amountErr}>{showAmount}</FieldError>
              <div className="flex gap-2">
                {[10, 25, 50, 100].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(String(v))}
                    className="rounded-lg border px-3 py-1 text-xs font-medium tabular-nums hover:bg-muted"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={ids.note}>
                Note <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id={ids.note}
                value={note}
                maxLength={120}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Split for canteen lunch"
              />
              <FieldHint>{note.length}/120 · Stored in this session only, not on-chain.</FieldHint>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Fuel className="size-4" aria-hidden /> Estimated network fee
              </span>
              <span className="font-medium">~0.0001 {appConfig.nativeCurrency.symbol}</span>
            </div>

            <Button type="submit" className="h-12 rounded-xl text-base">
              Review transaction <ArrowRight aria-hidden />
            </Button>
          </form>
        </CardContent>
      </Card>

      <aside className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">To</dt>
                <dd className="truncate font-medium">{contact?.name ?? (to && !toError ? shortenAddress(to) : '—')}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-medium tabular-nums">{amount && !amountError ? formatCC(amount) : '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Network fee</dt>
                <dd className="text-muted-foreground">Paid in ETH</dd>
              </div>
              <div className="flex justify-between gap-3 border-t pt-3">
                <dt className="font-medium">Total</dt>
                <dd className="font-semibold tabular-nums">{amount && !amountError ? formatCC(amount) : '0 CC'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="rounded-xl border bg-card p-5 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <ShieldCheck className="size-4 text-success" aria-hidden /> Signed in your wallet
          </p>
          <p className="mt-1.5 text-muted-foreground">
            CampusCoin never holds your keys. Every transfer is approved by you in MetaMask before it is broadcast.
          </p>
        </div>

        {(!isContractConfigured || isDemo) && (
          <div className="rounded-xl border border-dashed p-5 text-sm">
            <DemoBadge />
            <p className="mt-2 flex gap-2 text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              {isContractConfigured
                ? 'Connect your wallet to see your live balance and send real transfers.'
                : 'The contract address is not configured, so you can review transfers but none will be broadcast.'}
            </p>
          </div>
        )}
      </aside>

      <TransferConfirmModal
        open={details !== null}
        details={details}
        title="Review transfer"
        onClose={() => setDetails(null)}
        onConfirmed={resetForm}
      />
    </div>
  )
}
