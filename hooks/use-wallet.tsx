'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { appConfig } from '@/lib/config'
import {
  getChainId,
  getConnectedAccounts,
  getInjectedProvider,
  requestAccounts,
  subscribeToWalletEvents,
  switchToConfiguredNetwork,
} from '@/services/wallet-service'
import { describeBlockchainError } from '@/services/blockchain-service'

type WalletStatus = 'disconnected' | 'connecting' | 'connected'

interface WalletContextValue {
  address: string | null
  chainId: number | null
  status: WalletStatus
  hasProvider: boolean
  isCorrectNetwork: boolean
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: () => Promise<void>
}

const WalletContext = createContext<WalletContextValue | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [status, setStatus] = useState<WalletStatus>('disconnected')
  const [hasProvider, setHasProvider] = useState(false)

  useEffect(() => {
    const provider = getInjectedProvider()
    setHasProvider(Boolean(provider))
    if (!provider) return

    getConnectedAccounts()
      .then(async (accounts) => {
        if (accounts[0]) {
          setAddress(accounts[0])
          setChainId(await getChainId())
          setStatus('connected')
        }
      })
      .catch(() => {})

    return subscribeToWalletEvents({
      onAccountsChanged: (accounts) => {
        if (accounts[0]) {
          setAddress(accounts[0])
          setStatus('connected')
        } else {
          setAddress(null)
          setStatus('disconnected')
        }
      },
      onChainChanged: setChainId,
    })
  }, [])

  const connect = useCallback(async () => {
    if (!getInjectedProvider()) {
      toast.error('MetaMask not detected', {
        description: 'Install the MetaMask extension, or open this app in a wallet browser.',
      })
      return
    }
    setStatus('connecting')
    try {
      const accounts = await requestAccounts()
      setAddress(accounts[0] ?? null)
      setChainId(await getChainId())
      setStatus(accounts[0] ? 'connected' : 'disconnected')
      if (accounts[0]) toast.success('Wallet connected')
    } catch (error) {
      setStatus('disconnected')
      toast.error('Could not connect wallet', { description: describeBlockchainError(error) })
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setStatus('disconnected')
    toast('Wallet disconnected from CampusCoin', {
      description: 'To fully revoke access, disconnect this site in MetaMask.',
    })
  }, [])

  const switchNetwork = useCallback(async () => {
    try {
      await switchToConfiguredNetwork()
      setChainId(await getChainId())
    } catch (error) {
      toast.error('Network switch failed', { description: describeBlockchainError(error) })
    }
  }, [])

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      chainId,
      status,
      hasProvider,
      isCorrectNetwork: chainId === appConfig.chainId,
      connect,
      disconnect,
      switchNetwork,
    }),
    [address, chainId, status, hasProvider, connect, disconnect, switchNetwork],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
