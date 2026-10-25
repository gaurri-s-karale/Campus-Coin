'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, ScanLine } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DetectedBarcode {
  rawValue: string
}
interface BarcodeDetectorLike {
  detect: (source: HTMLVideoElement) => Promise<DetectedBarcode[]>
}
type BarcodeDetectorCtor = new (opts: { formats: string[] }) => BarcodeDetectorLike

function getDetectorCtor(): BarcodeDetectorCtor | null {
  if (typeof window === 'undefined') return null
  return ((window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector ?? null)
}

/**
 * Uses the native BarcodeDetector API (Chromium, Android, recent Safari).
 * Browsers without it fall back to pasting the payment request.
 */
export function CameraScanner({ onScan }: { onScan: (value: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const frameRef = useRef<number | null>(null)
  const [state, setState] = useState<'idle' | 'starting' | 'scanning' | 'unsupported' | 'denied'>('idle')

  const stop = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setState((s) => (s === 'scanning' || s === 'starting' ? 'idle' : s))
  }, [])

  useEffect(() => stop, [stop])

  const start = async () => {
    const Ctor = getDetectorCtor()
    if (!Ctor || !navigator.mediaDevices?.getUserMedia) {
      setState('unsupported')
      return
    }
    setState('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      await video.play()
      setState('scanning')
      const detector = new Ctor({ formats: ['qr_code'] })
      const tick = async () => {
        if (!streamRef.current) return
        try {
          const codes = await detector.detect(video)
          if (codes[0]?.rawValue) {
            stop()
            onScan(codes[0].rawValue)
            return
          }
        } catch {
          // Frame not ready yet; try again next frame.
        }
        frameRef.current = requestAnimationFrame(tick)
      }
      frameRef.current = requestAnimationFrame(tick)
    } catch {
      setState('denied')
    }
  }

  const active = state === 'scanning' || state === 'starting'

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-foreground">
        <video
          ref={videoRef}
          muted
          playsInline
          className={active ? 'size-full object-cover' : 'hidden'}
          aria-label="Camera preview for QR scanning"
        />
        {active && (
          <div aria-hidden className="pointer-events-none absolute inset-10 rounded-xl border-2 border-white/80">
            <ScanLine className="absolute top-1/2 left-1/2 size-10 -translate-1/2 animate-pulse text-white/70" />
          </div>
        )}
        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-sidebar-foreground">
            {state === 'unsupported' || state === 'denied' ? (
              <CameraOff className="size-10 text-sidebar-muted" aria-hidden />
            ) : (
              <Camera className="size-10 text-sidebar-primary" aria-hidden />
            )}
            <p className="max-w-56 text-sm">
              {state === 'unsupported'
                ? 'Camera scanning is not supported in this browser. Paste the payment request instead.'
                : state === 'denied'
                  ? 'Camera access was blocked. Allow camera access or paste the payment request.'
                  : 'Point your camera at a vendor’s CampusCoin QR code.'}
            </p>
          </div>
        )}
      </div>
      {active ? (
        <Button variant="outline" className="h-11 rounded-xl" onClick={stop}>
          Stop camera
        </Button>
      ) : (
        <Button className="h-11 rounded-xl" onClick={start} disabled={state === 'unsupported'}>
          <Camera aria-hidden /> Start camera scan
        </Button>
      )}
    </div>
  )
}
