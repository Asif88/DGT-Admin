"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/service"

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
