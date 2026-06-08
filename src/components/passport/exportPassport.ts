// Client-side passport export. Renders a passport DOM node to a 9:16 PNG via
// html-to-image (lazy-loaded). Callers capture an off-screen 1080px-wide
// instance, so the output is a crisp 1080x1920 Stories-ready image.

/**
 * Resolve once the DISPLAY font (Anton) is actually loaded, not just when
 * document.fonts.ready settles. `fonts.ready` can resolve before a <link> font
 * is even pending, so on a cold load the masthead fit can run on fallback
 * metrics and overshoot. `fonts.load()` forces and confirms the real font.
 */
export function whenDisplayFontReady(): Promise<unknown> {
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
  if (!fonts) return Promise.resolve()
  return Promise.all([
    fonts.ready.catch(() => {}),
    fonts.load('400 16px Anton').catch(() => {}),
  ])
}

/** Wait for the display font and a couple of frames so fit-to-width has settled. */
async function waitForRenderReady() {
  await whenDisplayFontReady()
  // Let the component's own font-driven re-fit (a microtask) apply before we
  // measure/capture, then flush layout over two frames.
  await new Promise<void>((resolve) => setTimeout(resolve, 90))
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )
}

const OPTS = { pixelRatio: 1, cacheBust: true } as const

export async function capturePassportBlob(node: HTMLElement): Promise<Blob> {
  const { toBlob } = await import('html-to-image')
  await waitForRenderReady()
  const blob = await toBlob(node, OPTS)
  if (!blob) throw new Error('Export produced no image')
  return blob
}

export async function capturePassportDataUrl(node: HTMLElement): Promise<string> {
  const { toPng } = await import('html-to-image')
  await waitForRenderReady()
  return toPng(node, OPTS)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
