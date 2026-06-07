import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import EditChapterForm from "./edit-chapter-form"

type Chapter = {
  id: string
  number: number
  icon: string
}

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: chapter } = await supabase
    .from("chapters")
    .select("id, number, icon")
    .eq("id", id)
    .single()

  if (!chapter) {
    notFound()
  }

  const { number, icon } = chapter as Chapter

  return <EditChapterForm id={id} number={number} icon={icon} />
}
