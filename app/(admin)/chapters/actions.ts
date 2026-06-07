"use server"

import { redirect } from "next/navigation"
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
