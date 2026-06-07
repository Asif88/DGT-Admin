import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createServiceClient } from "@/lib/supabase/service"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SuspendButton } from "@/components/users/suspend-button"
import { ActivateButton } from "@/components/users/activate-button"

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Never"
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceClient()

  const [{ data: userData, error: userError }, { data: profile }] =
    await Promise.all([
      supabase.auth.admin.getUserById(id),
      supabase.from("profiles").select("*").eq("id", id).single(),
    ])

  if (userError || !userData?.user) {
    notFound()
  }

  const user = userData.user
  const isSuspended =
    !!user.banned_until && new Date(user.banned_until) > new Date()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/users"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Users
        </Link>
      </div>

      <h1 className="text-2xl font-bold">User Detail</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Language</p>
              <p className="font-medium">{profile?.language ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={isSuspended ? "destructive" : "secondary"}>
                {isSuspended ? "Suspended" : "Active"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="font-medium">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last sign in</p>
              <p className="font-medium">{formatDate(user.last_sign_in_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        {isSuspended ? (
          <ActivateButton id={id} />
        ) : (
          <SuspendButton id={id} />
        )}
      </div>
    </div>
  )
}
