import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { createServiceClient } from "@/lib/supabase/service"
import { Button } from "@/components/ui/button"
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

export default async function UsersPage() {
  const supabase = createServiceClient()

  const { data: authData, error: authError } =
    await supabase.auth.admin.listUsers()

  if (authError) {
    throw new Error(`Failed to load users: ${authError.message}`)
  }

  const users = (authData?.users ?? []).map((user) => ({
    id: user.id,
    email: user.email ?? "—",
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at,
  }))

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

      <Card>
        <CardContent className="p-0">
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-36">Joined</TableHead>
                  <TableHead className="w-36">Last sign in</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.lastSignInAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/users/${user.id}`} />}
                      >
                        View
                      </Button>
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
