'use client'

import { useId, useState } from 'react'
import { CheckCircle2, ClipboardPaste, QrCode, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label, Textarea } from '@/components/ui/field'
import { DemoBadge } from '@/components/shared/primitives'
import { TransferConfirmModal, type TransferDetails } from '@/components/shared/transfer-confirm-modal'
import { demoVendors } from '@/lib/demo-data'
import { formatCC, shortenAddress } from '@/lib/format'
import { encodePaymentRequest, parsePaymentRequest, type ParseResult } from '@/lib/payment-request'
import type { PaymentRequest } from '@/lib/types'
import { CameraScanner } from './camera-scanner'

const sampleRequests = [
  { vendor: demoVendors[0], amount: '45', ref: 'ORD-1042' },
  { vendor: demoVendors[3], amount: '32', ref: 'PRN-588' },
]

export function QrPaymentsView() {
  const inputId = useId()
  const errorId = useId()
  const [raw, setRaw] = useState('')
  const [result, setResult] = useState<ParseResult | null>(null)
  const [details, setDetails] = useState<TransferDetails | null>(null)

  const parse = (value: string) => {
    setRaw(value)
    setResult(value.trim() ? parsePaymentRequest(value) : null)
  }

  const pasteFromClipboard = async () => {
    try {
      parse(await navigator.clipboard.readText())
    } catch {
      setResult({ ok: false, error: 'Clipboard access was denied. Paste manually into the field.' })
    }
  }

  const review = (request: PaymentRequest) => {
    const vendorName =
      request.vendor ?? demoVendors.find((v) => v.address.toLowerCase() === request.to.toLowerCase())?.name
    setDetails({
      to: request.to,
      amount: request.amount,
      label: vendorName ?? shortenAddress(request.to),
      note: request.reference ? `Ref ${request.reference}` : undefined,
      type: 'payment',
      extraRows: request.reference ? [{ label: 'Reference', value: request.reference }] : undefined,
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div>
            <CardTitle>Scan QR code</CardTitle>
            <CardDescription>Use your device camera to scan a vendor request.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <CameraScanner onScan={parse} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6 lg:col-span-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Paste payment request</CardTitle>
              <CardDescription>Or paste the text encoded in the vendor&apos;s QR code.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Label htmlFor={inputId} className="sr-only">
              Payment request
            </Label>
            <Textarea
              id={inputId}
              value={raw}
              onChange={(e) => parse(e.target.value)}
              placeholder="campuscoin:pay?to=0x…&amount=45&vendor=North%20Block%20Canteen"
              spellCheck={false}
              className="min-h-24 font-mono text-xs"
              aria-invalid={result?.ok === false}
              aria-describedby={errorId}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg" onClick={pasteFromClipboard}>
                <ClipboardPaste aria-hidden /> Paste from clipboard
              </Button>
              <span className="text-xs text-muted-foreground">Try a sample:</span>
              {sampleRequests.map((s) => (
                <button
                  key={s.ref}
                  type="button"
                  onClick={() =>
                    parse(
                      encodePaymentRequest({
                        to: s.vendor.address,
                        amount: s.amount,
                        vendor: s.vendor.name,
                        reference: s.ref,
                      }),
                    )
                  }
                  className="rounded-full border px-2.5 py-1 text-xs hover:bg-muted"
                >
                  {s.vendor.name.split(' ')[0]} · {s.amount} CC
                </button>
              ))}
            </div>

            <div id={errorId} aria-live="polite">
              {result?.ok === false && (
                <p className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                  <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {result.error}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {result?.ok ? (
          <Card className="border-primary/30">
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" aria-hidden /> Valid payment request
                </CardTitle>
                <CardDescription>Check the details match what the vendor told you.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Vendor</dt>
                  <dd className="mt-0.5 font-medium">{result.request.vendor ?? 'Unnamed recipient'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Amount</dt>
                  <dd className="mt-0.5 text-xl font-semibold tabular-nums">{formatCC(result.request.amount)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Recipient address</dt>
                  <dd className="mt-0.5 font-mono text-xs break-all">{result.request.to}</dd>
                </div>
                {result.request.reference && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Reference</dt>
                    <dd className="mt-0.5 font-mono text-sm">{result.request.reference}</dd>
                  </div>
                )}
              </dl>
              <Button className="mt-5 h-11 w-full rounded-xl" onClick={() => review(result.request)}>
                Review &amp; pay
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center gap-4 rounded-xl border border-dashed p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
              <QrCode className="size-5" aria-hidden />
            </span>
            <div className="text-sm">
              <p className="font-medium">Waiting for a payment request</p>
              <p className="text-muted-foreground">
                Vendors generate these from the Vendor Dashboard. <DemoBadge className="ml-1" label="Samples are demo" />
              </p>
            </div>
          </div>
        )}
      </div>

      <TransferConfirmModal
        open={details !== null}
        details={details}
        title="Confirm QR payment"
        onClose={() => setDetails(null)}
        onConfirmed={() => parse('')}
      />
    </div>
  )
}
