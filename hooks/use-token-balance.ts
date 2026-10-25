'use client'

import useSWR from 'swr'
import { isContractConfigured } from '@/lib/config'
import { demoStudent } from '@/lib/demo-data'
import { getTokenBalance } from '@/services/blockchain-service'
import { useWallet } from './use-wallet'

/**
 * Returns the live on-chain CC balance when a wallet is connected and the
 * contract is configured. Otherwise falls back to clearly-labelled demo data.
 */
export function useTokenBalance() {
  const { address, isCorrectNetwork } = useWallet()
  const isLive = Boolean(address && isContractConfigured)

  const { data, error, isLoading, mutate } = useSWR(
    isLive ? ['cc-balance', address] : null,
    ([, owner]) => getTokenBalance(owner as string),
    { refreshInterval: 20_000 },
  )

  return {
    balance: isLive ? (data ?? null) : demoStudent.balance,
    isDemo: !isLive,
    isLoading: isLive && isLoading,
    error: error as Error | undefined,
    isCorrectNetwork,
    refresh: mutate,
  }
}
