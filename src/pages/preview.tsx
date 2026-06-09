import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NATION_BY_CODE } from '../data/nations'
import { assemblePassport } from '../lib/passport'
import { SupporterPassport } from '../components/passport/SupporterPassport'
import { PassportActions } from '../components/passport/PassportActions'
import { capturePassportDataUrl } from '../components/passport/exportPassport'
import { useCreatePassport } from '../lib/use-create-passport'
import { Button } from '../components/ui'
import type { QuizAnswers } from '../lib/assign'

const NEUTRAL: QuizAnswers = {
  heritage: null, underdog: 0, playstyle: null, archetype: null, rivalCode: null, energy: null,
}

const CODES = ['ARG', 'BRA', 'MEX', 'MAR', 'FRA', 'CIV', 'GHA', 'CUW', 'SUI', 'NED', 'KSA', 'BIH']

/** Renders the ACTUAL exported PNG back into the page, to verify export fidelity. */
function ExportProof({ code }: { code: string }) {
  const host = useRef<HTMLDivElement>(null)
  const [url, setUrl] = useState<string>()
  const [err, setErr] = useState<string>()
  const passport = useMemo(() => assemblePassport(NATION_BY_CODE[code], NEUTRAL), [code])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const node = host.current?.querySelector('.passport') as HTMLElement
        const dataUrl = await capturePassportDataUrl(node)
        if (alive) setUrl(dataUrl)
      } catch (e) {
        if (alive) setErr(String(e))
      }
    })()
    return () => { alive = false }
  }, [code])

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Exported PNG (1080x1920)
      </p>
      <div ref={host} aria-hidden style={{ position: 'fixed', left: -99999, top: 0, width: 1080 }}>
        <SupporterPassport passport={passport} className="passport--export" />
      </div>
      {url
        ? <img src={url} alt={`${code} export`} style={{ width: 300 }} />
        : <p className="text-sm text-muted-foreground">{err ?? 'Exporting...'}</p>}
    </div>
  )
}

/** Dev-only gallery for iterating the passport visual. Real /p/[id] comes later. */
export default function Preview() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const single = params?.get('code')?.toUpperCase() ?? null
  const exportCode = params?.get('export')?.toUpperCase() ?? null
  const [playKey, setPlayKey] = useState(0)

  const passports = useMemo(
    () => CODES.map((c) => assemblePassport(NATION_BY_CODE[c], NEUTRAL)),
    [],
  )

  if (exportCode && NATION_BY_CODE[exportCode]) return <ExportProof code={exportCode} />

  if (single && NATION_BY_CODE[single]) {
    const passport = assemblePassport(NATION_BY_CODE[single], NEUTRAL)
    return (
      <div className="flex flex-col items-center gap-5 px-4 py-4">
        <div className="w-[368px] max-w-full">
          <SupporterPassport key={playKey} passport={passport} reveal />
        </div>
        <PassportActions passport={passport} />
        <button
          onClick={() => setPlayKey((k) => k + 1)}
          className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          Replay reveal
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10">
      <div className="mb-8 flex flex-col items-center gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Supporter Passport / preview
        </p>
        <CreateTestPassport />
      </div>
      <div className="flex flex-wrap justify-center gap-7">
        {passports.map((p) => (
          <div key={p.nation.code} className="w-[360px]">
            <SupporterPassport passport={p} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Dev-only: persist a real passport and open its /p/[id] page. */
function CreateTestPassport() {
  const create = useCreatePassport()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  const samples: QuizAnswers[] = [
    { heritage: null, underdog: 2, playstyle: 'flair', archetype: 'party', rivalCode: null, energy: 'joyful' },
    { heritage: 'mexico', underdog: 0, playstyle: null, archetype: null, rivalCode: null, energy: 'passionate' },
    { heritage: null, underdog: -2, archetype: 'champion', playstyle: 'technical', rivalCode: null, energy: 'cool' },
    { heritage: 'south-america', underdog: 1, playstyle: 'flair', archetype: null, rivalCode: null, energy: 'passionate' },
  ]

  async function make() {
    setBusy(true)
    try {
      const sample = samples[Math.floor(Math.random() * samples.length)]
      const shareId = await create(sample)
      navigate(`/p/${shareId}?new=1`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button loading={busy} onClick={make}>
      Create a real passport
    </Button>
  )
}
