'use client'

import { AlertTriangle, CheckCircle2, ExternalLink, Loader2, Wallet, XCircle } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/hooks/use-wallet'
import { useTokenTransfer } from '@/hooks/use-token-transfer'
import { appConfig, explorerTxUrl, isContractConfigured } from '@/lib/config'
import { formatCC, shortenAddress } from '@/lib/format'
import type { TransactionType } from '@/lib/types'

export interface TransferDetails {
  to: string
  amount: string
  label: string
  note?: string
  type?: TransactionType
  demo?: boolean
  extraRows?: { label: string; value: string }[]
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? 'text-right font-mono text-xs break-all' : 'text-right font-medium'}>{value}</dd>
    </div>
  )
}

export function TransferConfirmModal({
  open,
  onClose,
  details,
  title = 'Confirm transaction',
  onConfirmed,
}: {
  open: boolean
  onClose: () => void
  details: TransferDetails | null
  title?: string
  onConfirmed?: () => void
}) {
  const wallet = useWallet()
  const transfer = useTokenTransfer()
  const busy = transfer.status === 'awaiting-signature' || transfer.status === 'pending'

  const handleClose = () => {
    if (busy) return
    const wasConfirmed = transfer.status === 'confirmed'
    transfer.reset()
    onClose()
    if (wasConfirmed) onConfirmed?.()
  }

  if (!details) return null

  const blocker = !isContractConfigured
    ? 'contract'
    : details.demo
      ? 'demo'
      : wallet.status !== 'connected'
        ? 'wallet'
        : !wallet.isCorrectNetwork
          ? 'network'
          : null

  return (
    <Modal open={open} onClose={handleClose} title={title} dismissible={!busy}>
      {(transfer.status === 'idle' || transfer.status === 'error') && (
        <>
          <div className="rounded-xl bg-muted/60 px-4 py-4 text-center">
            <p className="text-xs text-muted-foreground">You are sending</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{formatCC(details.amount)}</p>
            <p className="mt-1 text-sm text-muted-foreground">to {details.label}</p>
          </div>

          <dl className="mt-4 divide-y">
            <Row label="Recipient" value={details.label} />
            <Row label="Address" value={details.to} mono />
            {details.extraRows?.map((r) => <Row key={r.label} label={r.label} value={r.value} />)}
            {details.note && <Row label="Note" value={details.note} />}
            <Row label="Amount" value={formatCC(details.amount)} />
            <Row label="Network fee" value={<span className="text-muted-foreground">Estimated by wallet</span>} />
            <Row label="Total" value={<span className="text-base">{formatCC(details.amount)} + gas</span>} />
          </dl>

          <p className="mt-2 text-xs text-muted-foreground">
            The network fee is paid in {appConfig.nativeCurrency.symbol} and shown by MetaMask before you sign. The note
            is stored locally only and is not written on-chain.
          </p>

          {transfer.status === 'error' && transfer.error && (
            <div role="alert" className="mt-4 flex gap-2.5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{transfer.error}</span>
            </div>
          )}

          {blocker === 'contract' && (
            <div className="mt-4 flex gap-2.5 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[oklch(0.5_0.12_65)]" aria-hidden />
              <p>
                <span className="font-medium">On-chain transfers are disabled.</span> The CampusCoin contract address is
                not configured, so no transaction will be sent. Set{' '}
                <code className="rounded bg-muted px-1 font-mono text-xs">NEXT_PUBLIC_CAMPUSCOIN_CONTRACT_ADDRESS</code>{' '}
                to enable this.
              </p>
            </div>
          )}

          {blocker === 'demo' && (
            <div className="mt-4 flex gap-2.5 rounded-xl border border-dashed p-3 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <p>This is a sample vendor address. Demo destinations cannot receive real CampusCoin.</p>
            </div>
          )}

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="h-11 rounded-xl" onClick={handleClose}>
              Cancel
            </Button>
            {blocker === 'wallet' ? (
              <Button className="h-11 rounded-xl" onClick={wallet.connect} disabled={wallet.status === 'connecting'}>
                <Wallet aria-hidden /> Connect wallet to continue
              </Button>
            ) : blocker === 'network' ? (
              <Button className="h-11 rounded-xl" onClick={wallet.switchNetwork}>
                Switch to {appConfig.chainName}
              </Button>
            ) : (
              <Button
                className="h-11 rounded-xl"
                disabled={blocker === 'contract' || blocker === 'demo'}
                onClick={() =>
                  transfer.send({
                    to: details.to,
                    amount: details.amount,
                    label: details.label,
                    note: details.note,
                    type: details.type,
                  })
                }
              >
                {blocker === 'demo'
                  ? 'Sample preview only'
                  : transfer.status === 'error'
                    ? 'Try again'
                    : 'Confirm & sign in wallet'}
              </Button>
            )}
          </div>
        </>
      )}

      {(transfer.status === 'awaiting-signature' || transfer.status === 'pending') && (
        <div className="flex flex-col items-center py-6 text-center" aria-live="polite">
          <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
          <p className="mt-4 font-medium">
            {transfer.status === 'awaiting-signature' ? 'Waiting for your signature' : 'Waiting for confirmation'}
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            {transfer.status === 'awaiting-signature'
              ? 'Review and approve the transaction in MetaMask.'
              : 'Your transaction was submitted and is being mined. This usually takes 10–30 seconds.'}
          </p>
          {transfer.txHash && (
            <a
              href={explorerTxUrl(transfer.txHash)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
            >
              {shortenAddress(transfer.txHash, 6)} <ExternalLink className="size-3" aria-hidden />
            </a>
          )}
        </div>
      )}

      {transfer.status === 'confirmed' && (
        <div className="flex flex-col items-center py-4 text-center" aria-live="polite">
          <span className="grid size-14 place-items-center rounded-full bg-success/12">
            <CheckCircle2 className="size-8 text-success" aria-hidden />
          </span>
          <p className="mt-4 text-lg font-semibold">Payment confirmed</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCC(details.amount)} was sent to {details.label} and confirmed on {appConfig.chainName}.
          </p>
          {transfer.txHash && (
            <a
              href={explorerTxUrl(transfer.txHash)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-sm font-medium hover:bg-muted/70"
            >
              View on Etherscan <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
          <Button className="mt-5 h-11 w-full rounded-xl" onClick={handleClose}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  )
}
