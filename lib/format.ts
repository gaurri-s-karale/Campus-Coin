export function shortenAddress(address: string, chars = 4) {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`
}

const ccFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

export function formatCC(value: number | string) {
  const n = typeof value === 'string' ? Number(value) : value
  return `${ccFormatter.format(Number.isFinite(n) ? n : 0)} CC`
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
})

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso))
}

export function formatTime(iso: string) {
  return timeFormatter.format(new Date(iso))
}
