import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'deepspace'
import NumberFlow from '@number-flow/react'
import { Button } from '../../components/ui'
import { SupporterPassport } from '../../components/passport/SupporterPassport'
import { PassportActions } from '../../components/passport/PassportActions'
import { passportFromRecord, type PassportRecord } from '../../lib/passport-record'

interface NationStat {
  nationCode: string
  count: number
}

export default function PassportPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const reveal = params.get('new') === '1'

  const { records, status } = useQuery<PassportRecord>('passports', {
    where: { shareId: id },
    limit: 1,
  })
  const record = records[0]
  const passport = record ? passportFromRecord(record.data) : null

  // Live "1 of N" supporter count for this nation.
  const { records: statRecords } = useQuery<NationStat>('nationStats', {
    where: { nationCode: passport?.nation.code ?? '__none__' },
  })
  const total = Math.max(
    passport?.supporterNumber ?? 1,
    ...statRecords.map((r) => r.data.count),
  )

  if (status === 'loading') {
    return (
      <div className="flex min-h-full items-center justify-center px-6">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Developing your passport
        </p>
      </div>
    )
  }

  if (!passport) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 className="font-display text-5xl uppercase text-foreground">Gone</h1>
        <p className="max-w-sm text-muted-foreground">
          This passport flew away, or never existed. Make your own in sixty seconds.
        </p>
        <Button onClick={() => navigate('/')}>Find my team</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8">
      <div className="w-full max-w-[400px]">
        <SupporterPassport passport={passport} reveal={reveal} />
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        You are{' '}
        <span className="text-foreground">
          1 of <NumberFlow value={total} />
        </span>{' '}
        {passport.nation.name} supporters
      </p>

      <PassportActions passport={passport} />
    </div>
  )
}
