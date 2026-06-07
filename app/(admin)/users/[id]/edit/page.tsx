import Link from "next/link"
import { notFound } from "next/navigation"
import { createServiceClient } from "@/lib/supabase/service"
import { EditUserForm } from "./edit-user-form"

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase.auth.admin.getUserById(id)
  if (error || !data?.user) notFound()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/users/${id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← User
        </Link>
        <h1 className="text-2xl font-bold">Edit User</h1>
      </div>
      <EditUserForm id={id} currentEmail={data.user.email ?? ""} />
    </div>
  )
}
