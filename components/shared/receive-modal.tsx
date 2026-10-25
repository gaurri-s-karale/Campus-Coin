'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useCopy } from '@/hooks/use-copy'
import { appConfig } from '@/lib/config'
import { DemoBadge } from './primitives'

export function ReceiveModal({
  open,
  onClose,
  address,
  isDemo,
}: {
  open: boolean
  onClose: () => void
  address: string
  isDemo: boolean
}) {
  const { copy, copied } = useCopy()
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Receive CampusCoin"
      description={`Share this address to receive ${appConfig.tokenSymbol} on ${appConfig.chainName}.`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl border bg-white p-4">
          <QRCodeSVG value={address} size={188} fgColor="#151a33" level="M" />
        </div>
        {isDemo && <DemoBadge label="Demo address — connect a wallet for yours" />}
        <p className="w-full rounded-xl bg-muted px-3 py-2.5 text-center font-mono text-xs break-all">{address}</p>
        <Button className="h-11 w-full rounded-xl" onClick={() => copy(address, 'Address copied')}>
          {copied ? 'Copied' : 'Copy address'}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Only send {appConfig.tokenSymbol} tokens on {appConfig.chainName}. Assets sent on other networks may be lost.
        </p>
      </div>
    </Modal>
  )
}
