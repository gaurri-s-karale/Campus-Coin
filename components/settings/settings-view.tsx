'use client'

import { ExternalLink, LogOut } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AddressDisplay, DemoBadge } from '@/components/shared/primitives'
import { useWallet } from '@/hooks/use-wallet'
import { appConfig, isContractConfigured } from '@/lib/config'
import { demoStudent } from '@/lib/demo-data'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium break-all sm:text-right">{children}</dd>
    </div>
  )
}

export function SettingsView() {
  const wallet = useWallet()
  const connected = wallet.status === 'connected' && wallet.address

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Student profile</CardTitle>
            <CardDescription>Linked from the campus directory</CardDescription>
          </div>
          <DemoBadge />
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
              {demoStudent.initials}
            </span>
            <div>
              <p className="font-semibold">{demoStudent.name}</p>
              <p className="text-sm text-muted-foreground">{demoStudent.email}</p>
            </div>
          </div>
          <dl className="divide-y">
            <Row label="Student ID">{demoStudent.studentId}</Row>
            <Row label="Department">{demoStudent.department}</Row>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Connected wallet</CardTitle>
            <CardDescription>The wallet used to sign CampusCoin transfers</CardDescription>
          </div>
          {connected ? <Badge variant="success">Connected</Badge> : <Badge variant="muted">Not connected</Badge>}
        </CardHeader>
        <CardContent>
          {connected ? (
            <>
              <dl className="divide-y">
                <Row label="Address">
                  <AddressDisplay address={wallet.address!} chars={6} explorer />
                </Row>
                <Row label="Chain ID">
                  {wallet.chainId}{' '}
                  {!wallet.isCorrectNetwork && <Badge variant="warning" className="ml-1">Wrong network</Badge>}
                </Row>
              </dl>
              <Button variant="outline" className="mt-4 rounded-lg" onClick={wallet.disconnect}>
                <LogOut aria-hidden /> Disconnect
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                To fully revoke access, also remove this site from MetaMask&apos;s connected sites.
              </p>
            </>
          ) : (
            <Button className="rounded-lg" onClick={wallet.connect} disabled={!wallet.hasProvider || wallet.status === 'connecting'}>
              {wallet.hasProvider ? 'Connect wallet' : 'MetaMask not detected'}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <div>
            <CardTitle>Network configuration</CardTitle>
            <CardDescription>Set via NEXT_PUBLIC_* environment variables at build time</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid divide-y md:grid-cols-2 md:gap-x-10 md:divide-y-0">
            <div className="divide-y">
              <Row label="Network">{appConfig.chainName}</Row>
              <Row label="Chain ID">{appConfig.chainId}</Row>
              <Row label="RPC endpoint">
                <span className="font-mono text-xs">{appConfig.rpcUrl}</span>
              </Row>
            </div>
            <div className="divide-y">
              <Row label="Block explorer">
                <a
                  href={appConfig.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {appConfig.explorerUrl.replace(/^https?:\/\//, '')} <ExternalLink className="size-3" aria-hidden />
                </a>
              </Row>
              <Row label="Token contract">
                {isContractConfigured ? (
                  <span className="font-mono text-xs">{appConfig.contractAddress}</span>
                ) : (
                  <Badge variant="warning">Not configured — demo mode</Badge>
                )}
              </Row>
              <Row label="Token">
                {appConfig.tokenName} ({appConfig.tokenSymbol})
              </Row>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
