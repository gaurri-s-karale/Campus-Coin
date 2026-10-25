'use client'

import useSWR from 'swr'
import { isContractConfigured } from '@/lib/config'
import { demoStudent } from '@/lib/demo-data'
import { ContractNotConfiguredError, getTokenBalance } from '@/services/blockchain-service'
import { useWallet } from './use-wallet'

/**
 * Returns the live on-chain CC balance when a wallet is connected and the
 * contract is configured. Otherwise falls back to clearly-labelled demo data.
 */
export function useTokenBalance() {
  const { address, isCorrectNetwork } = useWallet()
  const isLive = Boolean(address && isCorrectNetwork && isContractConfigured)

  const { data, error, isLoading, mutate } = useSWR(
    isLive ? ['cc-balance', address] : null,
    ([, owner]) => getTokenBalance(owner as string),
    { refreshInterval: 20_000 },
  )

  return {
    // Demo values are only shown for the disconnected preview account. A
    // connected wallet with a wrong network/configuration/read error never
    // receives a plausible-looking sample balance.
    balance: isLive ? (data ?? null) : address ? null : demoStudent.balance,
    isDemo: !address,
    isLoading: isLive && isLoading,
    error:
      (error as Error | undefined) ??
      (address && !isContractConfigured ? new ContractNotConfiguredError() : undefined),
    isCorrectNetwork,
    refresh: mutate,
  }
}
