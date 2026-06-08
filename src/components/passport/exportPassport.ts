// Client-side passport export. Renders a passport DOM node to a 9:16 PNG via
// html-to-image (lazy-loaded). Callers capture an off-screen 1080px-wide
// instance, so the output is a crisp 1080x1920 Stories-ready image.

// The Anton @font-face (base64 data URI). We pass this to html-to-image as
// part of `fontEmbedCSS` rather than trusting its auto-embed, which proved
// unreliable for the display font (the export PNG fell back to a wider font and
// the masthead overflowed). Appended last so it wins the cascade.
import antonFontCss from '../../anton-font.css?raw'

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
/**
 * Size a nation-name element to span `fraction` of its container on one line.
 * On-screen uses ~full width (Anton renders correctly). The export uses a
 * smaller fraction because html-to-image rasterizes the masthead in a wider
 * fallback font; the headroom keeps the longest names from clipping in the PNG,
 * landing visually close to the on-screen full-width treatment.
 */
export function fitNameToWidth(el: HTMLElement, fraction = 1) {
  const parent = el.parentElement
  if (!parent) return
  const cs = getComputedStyle(parent)
  const inner = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
  const avail = inner * fraction - 4
  if (avail <= 0) return
  el.style.fontSize = '240px'
  const natural = el.scrollWidth
  if (natural <= 0) return
  const size = Math.min(240, (avail / natural) * 240)
  el.style.fontSize = `${size}px`
  const rendered = el.scrollWidth
  if (rendered > avail) el.style.fontSize = `${size * (avail / rendered)}px`
}

/** Fraction of the container the masthead targets when destined for the PNG. */
export const EXPORT_FIT_FRACTION = 0.88

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
  if (name) fitNameToWidth(name, EXPORT_FIT_FRACTION)
  await nextFrame()
  if (name) fitNameToWidth(name, EXPORT_FIT_FRACTION)
  await nextFrame()
}

const OPTS = { pixelRatio: 1, cacheBust: true } as const

type HtmlToImage = typeof import('html-to-image')

/** Auto-embed (best effort for the CDN body/mono fonts) + a guaranteed Anton. */
async function buildOptions(mod: HtmlToImage, node: HTMLElement) {
  let base = ''
  try {
    base = await mod.getFontEmbedCSS(node)
  } catch {
    /* fall back to just the display font */
  }
  return { ...OPTS, fontEmbedCSS: `${base}\n${antonFontCss}` }
}

export async function capturePassportBlob(node: HTMLElement): Promise<Blob> {
  const mod = await import('html-to-image')
  await prepareForCapture(node)
  const blob = await mod.toBlob(node, await buildOptions(mod, node))
  if (!blob) throw new Error('Export produced no image')
  return blob
}

export async function capturePassportDataUrl(node: HTMLElement): Promise<string> {
  const mod = await import('html-to-image')
  await prepareForCapture(node)
  return mod.toPng(node, await buildOptions(mod, node))
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
