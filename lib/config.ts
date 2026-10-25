import { isAddress } from 'ethers'

const rawContractAddress = process.env.NEXT_PUBLIC_CAMPUSCOIN_CONTRACT_ADDRESS ?? ''

export const appConfig = {
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? '11155111'),
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME ?? 'Sepolia Testnet',
  rpcUrl:
    process.env.NEXT_PUBLIC_RPC_URL ?? 'https://ethereum-sepolia-rpc.publicnode.com',
  explorerUrl: (
    process.env.NEXT_PUBLIC_EXPLORER_URL ?? 'https://sepolia.etherscan.io'
  ).replace(/\/$/, ''),
  contractAddress: isAddress(rawContractAddress) ? rawContractAddress : null,
  tokenName: 'CampusCoin',
  tokenSymbol: 'CC',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'SepoliaETH', decimals: 18 },
} as const

export const isContractConfigured = appConfig.contractAddress !== null

export function explorerTxUrl(hash: string) {
  return `${appConfig.explorerUrl}/tx/${hash}`
}

export function explorerAddressUrl(address: string) {
  return `${appConfig.explorerUrl}/address/${address}`
}
