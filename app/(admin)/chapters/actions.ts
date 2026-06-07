"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/service"

export async function createChapter(formData: FormData) {
  const number = Number(formData.get("number"))
  const icon = String(formData.get("icon")).trim()
  const nameEn = String(formData.get("nameEn")).trim()
  const nameEs = String(formData.get("nameEs")).trim()

  const supabase = createServiceClient()
  const { error } = await supabase.from("chapters").insert({
    number,
    icon,
    translations: {
      en: { name: nameEn },
      es: { name: nameEs },
    },
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
  const nameEn = String(formData.get("nameEn")).trim()
  const nameEs = String(formData.get("nameEs")).trim()

  const supabase = createServiceClient()
  const { error } = await supabase
    .from("chapters")
    .update({
      number,
      icon,
      translations: {
        en: { name: nameEn },
        es: { name: nameEs },
      },
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  redirect("/chapters")
}
