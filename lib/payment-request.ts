import { isAddress, getAddress } from 'ethers'
import type { PaymentRequest } from './types'

const SCHEME = 'campuscoin:pay'

export function encodePaymentRequest(request: PaymentRequest) {
  const params = new URLSearchParams({ to: request.to, amount: request.amount })
  if (request.vendor) params.set('vendor', request.vendor)
  if (request.reference) params.set('ref', request.reference)
  return `${SCHEME}?${params.toString()}`
}

export type ParseResult =
  | { ok: true; request: PaymentRequest }
  | { ok: false; error: string }

export function parsePaymentRequest(raw: string): ParseResult {
  const value = raw.trim()
  if (!value) return { ok: false, error: 'Payment request is empty.' }

  // `isAddress` is a type guard; checking a copy keeps `value` typed as string below.
  const looksLikeAddress = isAddress(String(value))
  if (looksLikeAddress) {
    return { ok: false, error: 'This is a wallet address, not a payment request. Use Send Tokens instead.' }
  }

  if (!value.startsWith(`${SCHEME}?`)) {
    return { ok: false, error: 'Not a CampusCoin payment request. It should start with "campuscoin:pay?".' }
  }

  const params = new URLSearchParams(value.slice(SCHEME.length + 1))
  const to = params.get('to') ?? ''
  const amount = params.get('amount') ?? ''

  if (!isAddress(to.toLowerCase())) {
    return { ok: false, error: 'Payment request contains an invalid recipient address.' }
  }
  const amountNumber = Number(amount)
  if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    return { ok: false, error: 'Payment request contains an invalid amount.' }
  }

  return {
    ok: true,
    request: {
      to: getAddress(to.toLowerCase()),
      amount,
      vendor: params.get('vendor') ?? undefined,
      reference: params.get('ref') ?? undefined,
    },
  }
}

export function validateRecipient(value: string): string | null {
  if (!value.trim()) return 'Recipient address is required.'
  if (!/^0x[0-9a-fA-F]{40}$/.test(value.trim())) {
    return 'Enter a valid Ethereum address (0x followed by 40 hex characters).'
  }
  if (!isAddress(value.trim()) && !isAddress(value.trim().toLowerCase())) {
    return 'Address checksum is invalid.'
  }
  return null
}

export function validateAmount(value: string, max?: number): string | null {
  if (!value.trim()) return 'Amount is required.'
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return 'Amount must be greater than 0.'
  if (!/^\d+(\.\d{1,6})?$/.test(value.trim())) return 'Use up to 6 decimal places.'
  if (max !== undefined && n > max) return `Amount exceeds your balance of ${max} CC.`
  return null
}
