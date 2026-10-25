export type TransactionType = 'sent' | 'received' | 'payment' | 'reward'
export type TransactionStatus = 'confirmed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  hash: string
  type: TransactionType
  counterparty: string
  counterpartyAddress: string
  amount: number
  timestamp: string
  status: TransactionStatus
  note?: string
  /** "demo" records are sample data and do not exist on-chain. */
  source: 'demo' | 'onchain'
}

export type VendorCategory = 'canteen' | 'stationery' | 'printing' | 'events'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  tag?: string
}

export interface Vendor {
  id: string
  name: string
  category: VendorCategory
  location: string
  address: string
  rating: number
  hours: string
  status: 'active' | 'pending' | 'suspended'
  products: Product[]
}

export interface RewardActivity {
  id: string
  title: string
  description: string
  amount: number
  date: string
  category: 'academic' | 'events' | 'sustainability' | 'community'
}

export interface RewardChallenge {
  id: string
  title: string
  description: string
  reward: number
  progress: number
  goal: number
}

export interface PaymentRequest {
  to: string
  amount: string
  vendor?: string
  reference?: string
}

export type TransferStatus =
  | 'idle'
  | 'awaiting-signature'
  | 'pending'
  | 'confirmed'
  | 'error'

export interface ChartPoint {
  label: string
  value: number
}
