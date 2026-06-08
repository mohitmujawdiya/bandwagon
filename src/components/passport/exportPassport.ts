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

/**
 * Size a nation-name element to span its container on one line. Two passes: the
 * first estimates from a 240px measurement, the second measures the ACTUAL
 * rendered width and shrinks to fit (correcting for whatever font is active).
 * Shared by the on-screen component and the export so they never disagree.
 */
export function fitNameToWidth(el: HTMLElement) {
  const parent = el.parentElement
  if (!parent) return
  const cs = getComputedStyle(parent)
  const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
  if (avail <= 0) return
  el.style.fontSize = '240px'
  const natural = el.scrollWidth
  if (natural <= 0) return
  const size = Math.min(240, (avail / natural) * 240)
  el.style.fontSize = `${size}px`
  const rendered = el.scrollWidth
  if (rendered > avail) el.style.fontSize = `${size * (avail / rendered)}px`
}

async function nextFrame() {
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )
}

/**
 * Prepare a passport node for capture: confirm the display font, then re-fit the
 * masthead directly (so it never relies on the component's internal fit timing,
 * which can race the font load on a cold page), and flush layout.
 */
async function prepareForCapture(node: HTMLElement) {
  await whenDisplayFontReady()
  const name = node.querySelector('.passport__name') as HTMLElement | null
  // Fit, advance a frame, fit again: the second pass catches a font that only
  // became active across the frame boundary. Then flush once more before capture.
  if (name) fitNameToWidth(name)
  await nextFrame()
  if (name) fitNameToWidth(name)
  await nextFrame()
}

const OPTS = { pixelRatio: 1, cacheBust: true } as const

export async function capturePassportBlob(node: HTMLElement): Promise<Blob> {
  const { toBlob } = await import('html-to-image')
  await prepareForCapture(node)
  const blob = await toBlob(node, OPTS)
  if (!blob) throw new Error('Export produced no image')
  return blob
}

export async function capturePassportDataUrl(node: HTMLElement): Promise<string> {
  const { toPng } = await import('html-to-image')
  await prepareForCapture(node)
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
