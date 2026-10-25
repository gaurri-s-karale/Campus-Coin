import { BrowserProvider, toQuantity, type Eip1193Provider } from 'ethers'
import { appConfig } from '@/lib/config'

type InjectedProvider = Eip1193Provider & {
  isMetaMask?: boolean
  on?: (event: string, handler: (...args: unknown[]) => void) => void
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: InjectedProvider
  }
}

export class WalletUnavailableError extends Error {
  constructor() {
    super('No Ethereum wallet detected. Install MetaMask to continue.')
    this.name = 'WalletUnavailableError'
  }
}

export function getInjectedProvider(): InjectedProvider | null {
  if (typeof window === 'undefined') return null
  return window.ethereum ?? null
}

function requireProvider() {
  const provider = getInjectedProvider()
  if (!provider) throw new WalletUnavailableError()
  return provider
}

export async function requestAccounts(): Promise<string[]> {
  const provider = requireProvider()
  return (await provider.request({ method: 'eth_requestAccounts' })) as string[]
}

export async function getConnectedAccounts(): Promise<string[]> {
  const provider = getInjectedProvider()
  if (!provider) return []
  return (await provider.request({ method: 'eth_accounts' })) as string[]
}

export async function getChainId(): Promise<number> {
  const provider = requireProvider()
  const hex = (await provider.request({ method: 'eth_chainId' })) as string
  return Number.parseInt(hex, 16)
}

export async function switchToConfiguredNetwork() {
  const provider = requireProvider()
  const chainIdHex = toQuantity(appConfig.chainId)
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    })
  } catch (error) {
    if ((error as { code?: number }).code !== 4902) throw error
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: chainIdHex,
          chainName: appConfig.chainName,
          rpcUrls: [appConfig.rpcUrl],
          blockExplorerUrls: [appConfig.explorerUrl],
          nativeCurrency: appConfig.nativeCurrency,
        },
      ],
    })
  }
}

export function subscribeToWalletEvents(handlers: {
  onAccountsChanged: (accounts: string[]) => void
  onChainChanged: (chainId: number) => void
}) {
  const provider = getInjectedProvider()
  if (!provider?.on) return () => {}

  const accountsHandler = (accounts: unknown) => handlers.onAccountsChanged(accounts as string[])
  const chainHandler = (chainId: unknown) =>
    handlers.onChainChanged(Number.parseInt(chainId as string, 16))

  provider.on('accountsChanged', accountsHandler)
  provider.on('chainChanged', chainHandler)
  return () => {
    provider.removeListener?.('accountsChanged', accountsHandler)
    provider.removeListener?.('chainChanged', chainHandler)
  }
}

export async function getSigner() {
  const provider = new BrowserProvider(requireProvider())
  return provider.getSigner()
}
