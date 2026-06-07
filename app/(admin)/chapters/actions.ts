"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/service"

export async function createChapter(formData: FormData) {
  const number = Number(formData.get("number"))
  const icon = String(formData.get("icon")).trim()

  const supabase = createServiceClient()
  const { error } = await supabase.from("chapters").insert({
    number,
    icon,
  })

  if (error) throw new Error(error.message)
  redirect("/chapters")
}

export async function deleteChapter(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from("chapters").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/chapters")
}

export async function updateChapter(id: string, formData: FormData) {
  const number = Number(formData.get("number"))
  const icon = String(formData.get("icon")).trim()

  const supabase = createServiceClient()
  const { error } = await supabase
    .from("chapters")
    .update({
      number,
      icon,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  redirect("/chapters")
}
