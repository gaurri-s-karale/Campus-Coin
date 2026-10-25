import { Contract, JsonRpcProvider, formatUnits, getAddress, parseUnits } from 'ethers'
import { appConfig } from '@/lib/config'
import { getSigner } from './wallet-service'

/** Minimal ERC-20 ABI for the CampusCoin token. Extend once the contract is finalised. */
export const CAMPUSCOIN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
] as const

export class ContractNotConfiguredError extends Error {
  constructor() {
    super(
      'CampusCoin contract address is not configured. Set NEXT_PUBLIC_CAMPUSCOIN_CONTRACT_ADDRESS to enable on-chain transactions.',
    )
    this.name = 'ContractNotConfiguredError'
  }
}

function requireContractAddress() {
  if (!appConfig.contractAddress) throw new ContractNotConfiguredError()
  return appConfig.contractAddress
}

let readProvider: JsonRpcProvider | null = null
function getReadProvider() {
  readProvider ??= new JsonRpcProvider(appConfig.rpcUrl, appConfig.chainId)
  return readProvider
}

function getReadContract() {
  return new Contract(requireContractAddress(), CAMPUSCOIN_ABI, getReadProvider())
}

let cachedDecimals: number | null = null
async function getDecimals() {
  if (cachedDecimals === null) {
    cachedDecimals = Number(await getReadContract().decimals())
  }
  return cachedDecimals
}

export async function getTokenBalance(owner: string): Promise<number> {
  const contract = getReadContract()
  const [raw, decimals] = await Promise.all([contract.balanceOf(owner), getDecimals()])
  return Number(formatUnits(raw, decimals))
}

export async function getTotalSupply(): Promise<number> {
  const contract = getReadContract()
  const [raw, decimals] = await Promise.all([contract.totalSupply(), getDecimals()])
  return Number(formatUnits(raw, decimals))
}

export interface TransferResult {
  hash: string
  blockNumber: number
}

/**
 * Submits an ERC-20 transfer via the connected wallet and resolves only
 * after the transaction has been mined with a successful status.
 */
export async function transferTokens(params: {
  to: string
  amount: string
  onSubmitted?: (hash: string) => void
}): Promise<TransferResult> {
  const address = requireContractAddress()
  const signer = await getSigner()
  const contract = new Contract(address, CAMPUSCOIN_ABI, signer)
  const decimals = await getDecimals()

  const tx = await contract.transfer(getAddress(params.to.toLowerCase()), parseUnits(params.amount, decimals))
  params.onSubmitted?.(tx.hash)

  const receipt = await tx.wait()
  if (!receipt || receipt.status !== 1) {
    throw new Error('Transaction was mined but reverted by the contract.')
  }
  return { hash: tx.hash, blockNumber: receipt.blockNumber }
}

export function describeBlockchainError(error: unknown): string {
  const e = error as { code?: string | number; shortMessage?: string; message?: string }
  if (e.code === 'ACTION_REJECTED' || e.code === 4001) return 'You rejected the request in your wallet.'
  if (e.code === 'INSUFFICIENT_FUNDS') return 'Not enough SepoliaETH to pay the network fee.'
  if (e.code === 'CALL_EXCEPTION') return 'The contract rejected this transfer. Check your CC balance.'
  if (e.code === 'NETWORK_ERROR') return 'Network error. Check your connection and RPC endpoint.'
  return e.shortMessage ?? e.message ?? 'Something went wrong while sending the transaction.'
}
