'use client'

import useSWR from 'swr'
import { JsonRpcProvider, formatEther } from 'ethers'
import { appConfig } from '@/lib/config'
import { useWallet } from './use-wallet'

let provider: JsonRpcProvider | null = null
function getReadProvider() {
  provider ??= new JsonRpcProvider(appConfig.rpcUrl, appConfig.chainId, { staticNetwork: true })
  return provider
}

export function useNativeBalance() {
  const { address } = useWallet()
  const { data, isLoading } = useSWR(
    address ? ['native-balance', address] : null,
    async ([, owner]) => Number(formatEther(await getReadProvider().getBalance(owner as string))),
    { refreshInterval: 30_000 },
  )
  return { balance: address ? (data ?? null) : null, isLoading: Boolean(address) && isLoading }
}
