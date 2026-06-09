import { Link } from 'react-router-dom'

/**
 * Interim home / front door. Minimal but on-brand: it gets people into the quiz.
 * The full cinematic landing is its own impeccable craft (next).
 */
export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-9 px-6 py-12 text-center">
      <div>
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          World Cup 2026
        </p>
        <h1 className="font-display text-[clamp(3.2rem,13vw,6rem)] uppercase leading-[0.86] text-foreground">
          Find your
          <br />
          World Cup team
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          Sixty seconds, six questions, and one nation that's yours. Plus a Supporter Passport worth posting.
        </p>
      </div>

      <Link
        to="/quiz"
        className="rounded-xl bg-primary px-10 py-4 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-[background,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[oklch(0.58_0.2_32)]"
      >
        Find my team
      </Link>
    </div>
  )
}
