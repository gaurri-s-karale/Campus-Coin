'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useCopy(timeout = 1600) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const copy = useCallback(
    async (value: string, label = 'Copied to clipboard') => {
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        toast.success(label)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), timeout)
      } catch {
        toast.error('Clipboard unavailable', { description: 'Copy the value manually.' })
      }
    },
    [timeout],
  )

  return { copied, copy }
}
