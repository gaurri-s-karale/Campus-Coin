'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import type { Transaction } from '@/lib/types'

const KEY = 'campuscoin:session-transactions'

/**
 * Holds on-chain transactions confirmed during this browser session so the
 * history page can display them alongside demo records. Replace with an
 * indexer / Transfer-event query once the contract is deployed.
 */
export function useSessionTransactions() {
  const { data, mutate } = useSWR<Transaction[]>(KEY, null, { fallbackData: [] })

  const addTransaction = useCallback(
    (tx: Transaction) => mutate((current = []) => [tx, ...current], { revalidate: false }),
    [mutate],
  )

  return { transactions: data ?? [], addTransaction }
}
