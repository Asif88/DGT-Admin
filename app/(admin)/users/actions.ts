"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/service"

export async function createUser(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = String(formData.get("email")).trim()
  const password = String(formData.get("password"))

  const supabase = createServiceClient()
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    // No app_metadata.role set — these users must NOT be able to access the admin panel
  })

  if (error) return error.message
  redirect("/users")
}

export async function suspendUser(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.auth.admin.updateUserById(id, {
    ban_duration: "87600h", // 10 years
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/users/${id}`)
  revalidatePath("/users")
}

export async function activateUser(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.auth.admin.updateUserById(id, {
    ban_duration: "none",
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/users/${id}`)
  revalidatePath("/users")
}

export async function updateUser(
  id: string,
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = String(formData.get("email")).trim()
  const password = String(formData.get("password")).trim()

  const updates: { email?: string; password?: string } = {}
  if (email) updates.email = email
  if (password) updates.password = password

  if (Object.keys(updates).length === 0) return "No changes provided."

  const supabase = createServiceClient()
  const { error } = await supabase.auth.admin.updateUserById(id, updates)
  if (error) return error.message
  redirect(`/users/${id}`)
}

export async function deleteUser(id: string): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase.auth.admin.deleteUser(id)
  if (error) throw new Error(error.message)
  redirect("/users")
}
