'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import type { TransactionType, TransferStatus } from '@/lib/types'
import { describeBlockchainError, transferTokens } from '@/services/blockchain-service'
import { useSessionTransactions } from './use-session-transactions'
import { useTokenBalance } from './use-token-balance'

export function useTokenTransfer() {
  const [status, setStatus] = useState<TransferStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { addTransaction } = useSessionTransactions()
  const { refresh } = useTokenBalance()

  const send = useCallback(
    async (params: {
      to: string
      amount: string
      label: string
      note?: string
      type?: TransactionType
    }) => {
      setError(null)
      setTxHash(null)
      setStatus('awaiting-signature')
      try {
        const result = await transferTokens({
          to: params.to,
          amount: params.amount,
          onSubmitted: (hash) => {
            setTxHash(hash)
            setStatus('pending')
          },
        })
        setStatus('confirmed')
        addTransaction({
          id: result.hash,
          hash: result.hash,
          type: params.type ?? 'sent',
          counterparty: params.label,
          counterpartyAddress: params.to,
          amount: Number(params.amount),
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          note: params.note,
          source: 'onchain',
        })
        refresh()
        toast.success('Transaction confirmed on-chain', {
          description: `${params.amount} CC sent to ${params.label}.`,
        })
      } catch (err) {
        const message = describeBlockchainError(err)
        setError(message)
        setStatus('error')
        toast.error('Transaction not completed', { description: message })
      }
    },
    [addTransaction, refresh],
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setTxHash(null)
    setError(null)
  }, [])

  return { status, txHash, error, send, reset }
}
