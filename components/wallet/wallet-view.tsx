'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Coins, ExternalLink, Network, QrCode, RefreshCw, Send, Wallet } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AddressDisplay, DemoBadge } from '@/components/shared/primitives'
import { ReceiveModal } from '@/components/shared/receive-modal'
import { useWallet } from '@/hooks/use-wallet'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { appConfig, explorerAddressUrl, isContractConfigured } from '@/lib/config'
import { demoStudent } from '@/lib/demo-data'
import { formatCC } from '@/lib/format'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium">{children}</dd>
    </div>
  )
}

export function WalletView() {
  const wallet = useWallet()
  const { balance, isDemo, isLoading, error, refresh } = useTokenBalance()
  const [receiveOpen, setReceiveOpen] = useState(false)
  const connected = wallet.status === 'connected' && wallet.address
  const displayAddress = wallet.address ?? demoStudent.address

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Wallet connection</CardTitle>
              <CardDescription>CampusCoin works with MetaMask and other injected Ethereum wallets.</CardDescription>
            </div>
            {connected ? (
              <Badge variant="success">
                <CheckCircle2 aria-hidden className="size-3" /> Connected
              </Badge>
            ) : (
              <Badge variant="muted">Not connected</Badge>
            )}
          </CardHeader>
          <CardContent>
            {!wallet.hasProvider && !connected ? (
              <div className="flex flex-col gap-3 rounded-xl bg-muted/60 p-4 text-sm sm:flex-row sm:items-center">
                <Wallet className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                <p className="flex-1 text-muted-foreground">
                  No browser wallet detected. Install MetaMask to hold and send CampusCoin.
                </p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ variant: 'outline', className: 'rounded-lg' })}
                >
                  Install MetaMask <ExternalLink aria-hidden />
                </a>
              </div>
            ) : !connected ? (
              <div className="flex flex-col gap-3 rounded-xl bg-muted/60 p-4 text-sm sm:flex-row sm:items-center">
                <Wallet className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                <p className="flex-1 text-muted-foreground">Connect your wallet to view your live balance.</p>
                <Button onClick={wallet.connect} disabled={wallet.status === 'connecting'} className="rounded-lg">
                  {wallet.status === 'connecting' ? 'Connecting…' : 'Connect wallet'}
                </Button>
              </div>
            ) : (
              wallet.isCorrectNetwork || (
                <div className="flex flex-col gap-3 rounded-xl bg-warning/15 p-4 text-sm sm:flex-row sm:items-center">
                  <AlertTriangle className="size-5 shrink-0 text-[oklch(0.5_0.12_65)]" aria-hidden />
                  <p className="flex-1">
                    You&apos;re on chain {wallet.chainId}. Switch to {appConfig.chainName} to use CampusCoin.
                  </p>
                  <Button onClick={wallet.switchNetwork} className="rounded-lg">
                    Switch network
                  </Button>
                </div>
              )
            )}

            <dl className="mt-2 divide-y">
              <Row label="Address">
                <span className="inline-flex items-center gap-2">
                  {!connected && <DemoBadge label="Demo" />}
                  <AddressDisplay address={displayAddress} chars={6} explorer={Boolean(connected)} />
                </span>
              </Row>
              <Row label="Network">
                <span className="inline-flex items-center gap-1.5">
                  <Network className="size-3.5 text-muted-foreground" aria-hidden />
                  {connected ? (wallet.isCorrectNetwork ? appConfig.chainName : `Chain ${wallet.chainId}`) : appConfig.chainName}
                </span>
              </Row>
              <Row label="Gas token">{appConfig.nativeCurrency.symbol}</Row>
            </dl>

            {connected && (
              <Button variant="outline" className="mt-4 rounded-lg" onClick={wallet.disconnect}>
                Disconnect from CampusCoin
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Token details</CardTitle>
              <CardDescription>The ERC-20 contract behind CampusCoin.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <Row label="Name">{appConfig.tokenName}</Row>
              <Row label="Symbol">{appConfig.tokenSymbol}</Row>
              <Row label="Standard">ERC-20 · 18 decimals</Row>
              <Row label="Contract">
                {appConfig.contractAddress ? (
                  <a
                    href={explorerAddressUrl(appConfig.contractAddress)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                  >
                    {appConfig.contractAddress.slice(0, 10)}…{appConfig.contractAddress.slice(-6)}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                ) : (
                  <Badge variant="warning">Not configured</Badge>
                )}
              </Row>
            </dl>
            {!isContractConfigured && (
              <p className="mt-3 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
                Set <code className="font-mono">NEXT_PUBLIC_CAMPUSCOIN_CONTRACT_ADDRESS</code> to your deployed token to
                enable live balances and transfers.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <aside className="flex flex-col gap-6">
        <section className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="size-4" aria-hidden /> {appConfig.tokenName} balance
            </p>
            {!isDemo && (
              <button
                type="button"
                onClick={() => refresh()}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Refresh balance"
              >
                <RefreshCw className={isLoading ? 'size-4 animate-spin' : 'size-4'} aria-hidden />
              </button>
            )}
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums" aria-live="polite">
            {isLoading ? '…' : balance === null ? '—' : formatCC(balance)}
          </p>
          {error && <p className="mt-2 text-xs text-destructive">Couldn&apos;t load balance. Check your network.</p>}
          {isDemo && <p className="mt-2 text-xs text-muted-foreground">Demo balance — connect a wallet for live data.</p>}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/send" className={buttonVariants({ className: 'h-9 rounded-full' })}>
              <Send aria-hidden /> Send
            </Link>
            <Button variant="outline" className="h-9 rounded-full" onClick={() => setReceiveOpen(true)}>
              <QrCode aria-hidden /> Receive
            </Button>
          </div>
        </section>

        <div className="rounded-xl border bg-card p-5 text-sm">
          <p className="font-medium">Keep your wallet safe</p>
          <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4 text-muted-foreground">
            <li>Never share your seed phrase — CampusCoin staff will never ask for it.</li>
            <li>Always check the recipient before signing.</li>
            <li>Keep a little {appConfig.nativeCurrency.symbol} for network fees.</li>
          </ul>
        </div>
      </aside>

      <ReceiveModal open={receiveOpen} onClose={() => setReceiveOpen(false)} address={displayAddress} isDemo={!connected} />
    </div>
  )
}
