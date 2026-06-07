import Link from "next/link"
import { Pencil, PlusCircle } from "lucide-react"
import { createServiceClient } from "@/lib/supabase/service"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Never"
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role } = await searchParams
  const supabase = createServiceClient()

  const { data: authData, error: authError } =
    await supabase.auth.admin.listUsers()

  if (authError) {
    throw new Error(`Failed to load users: ${authError.message}`)
  }

  const users = (authData?.users ?? []).map((user) => ({
    id: user.id,
    email: user.email ?? "—",
    isAdmin: user.app_metadata?.role === "admin",
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at,
  }))

  const filtered =
    role === "admin"
      ? users.filter((u) => u.isAdmin)
      : role === "user"
      ? users.filter((u) => !u.isAdmin)
      : users

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button
          className="bg-brand text-white hover:bg-brand/90"
          nativeButton={false}
          render={<Link href="/users/new" />}
        >
          <PlusCircle className="size-4" />
          Add User
        </Button>
      </div>

      <div className="flex gap-2">
        {[
          { label: "All", value: undefined },
          { label: "Admin", value: "admin" },
          { label: "Users", value: "user" },
        ].map(({ label, value }) => {
          const isActive = (role ?? undefined) === value
          const href = value ? `/users?role=${value}` : "/users"
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand text-white"
                  : "border border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-24">Role</TableHead>
                  <TableHead className="w-36">Joined</TableHead>
                  <TableHead className="w-36">Last sign in</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <Badge variant="secondary">Admin</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.lastSignInAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          nativeButton={false}
                          render={<Link href={`/users/${user.id}`} />}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          nativeButton={false}
                          render={<Link href={`/users/${user.id}/edit`} />}
                        >
                          <Pencil className="size-4" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">No users yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
