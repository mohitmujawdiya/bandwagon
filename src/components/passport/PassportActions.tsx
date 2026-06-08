import { useRef, useState } from 'react'
import { Button, useToast } from '../ui'
import { SupporterPassport } from './SupporterPassport'
import { capturePassportBlob, downloadBlob } from './exportPassport'
import type { PassportData } from '../../lib/passport'

/**
 * Share / download / copy for a passport. Captures an off-screen 1080px-wide
 * instance to a 9:16 PNG, then uses the Web Share API (so the image lands intact
 * in WhatsApp / DMs / Stories) with a download + copy fallback on desktop.
 */
export function PassportActions({ passport }: { passport: PassportData }) {
  const exportHost = useRef<HTMLDivElement>(null)
  const { success, error } = useToast()
  const [busy, setBusy] = useState<null | 'share' | 'download'>(null)

  const { nation } = passport
  const caption = `I'm adopting ${nation.flagEmoji} ${nation.name} for the World Cup. Find your team: bandwagon.app`
  const filename = `bandwagon-${nation.code.toLowerCase()}.png`

  const grabNode = () => exportHost.current?.querySelector('.passport') as HTMLElement | null

  async function captureBlob(): Promise<Blob> {
    const node = grabNode()
    if (!node) throw new Error('Passport not ready')
    return capturePassportBlob(node)
  }

  async function onShare() {
    setBusy('share')
    try {
      const blob = await captureBlob()
      const file = new File([blob], filename, { type: 'image/png' })
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], text: caption })
      } else {
        downloadBlob(blob, filename)
        await navigator.clipboard?.writeText(caption).catch(() => {})
        success('Passport saved', 'Image downloaded and caption copied. Post it anywhere.')
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return // user dismissed the share sheet
      error('Could not share', (e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  async function onDownload() {
    setBusy('download')
    try {
      downloadBlob(await captureBlob(), filename)
      success('Downloaded', 'Your 9:16 passport is saved.')
    } catch (e) {
      error('Could not download', (e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(caption)
      success('Caption copied', 'Paste it with your passport anywhere.')
    } catch {
      error('Could not copy', 'Clipboard is unavailable here.')
    }
  }

  return (
    <>
      <div className="flex w-full max-w-[368px] items-center gap-2.5">
        <Button className="flex-1" loading={busy === 'share'} onClick={onShare}>
          Share
        </Button>
        <Button variant="outline" loading={busy === 'download'} onClick={onDownload}>
          Download
        </Button>
        <Button variant="ghost" onClick={onCopy}>
          Copy caption
        </Button>
      </div>

      {/* Off-screen full-res export instance (static, full-bleed, 1080px wide). */}
      <div
        ref={exportHost}
        aria-hidden
        style={{ position: 'fixed', left: -99999, top: 0, width: 1080, pointerEvents: 'none' }}
      >
        <SupporterPassport passport={passport} className="passport--export" />
      </div>
    </>
  )
}
