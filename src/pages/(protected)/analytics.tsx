/**
 * /analytics — admin-only. The (protected)/_layout already requires sign-in via
 * <AuthGate>; this page adds the role check so only the owner/admins see the
 * numbers. Signed-in non-admins get a friendly wall.
 */
import { useUser } from 'deepspace'
import { AnalyticsDashboard } from '../../components/admin/AnalyticsDashboard'

export default function AnalyticsPage() {
  const { user, isLoading } = useUser()
  const role = user?.role
  const isAdmin = role === 'admin' || role === 'owner'

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background text-muted-foreground">
        Loading
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <h1 className="font-display text-4xl uppercase tracking-tight text-foreground">Admins only</h1>
        <p className="max-w-sm text-muted-foreground">
          The numbers are for the Bandwagon team. You're signed in
          {role ? <> as a {role}</> : null}, but not as an admin.
        </p>
      </div>
    )
  }

  return <AnalyticsDashboard />
}
