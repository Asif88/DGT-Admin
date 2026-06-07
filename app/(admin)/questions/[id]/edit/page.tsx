import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { EditQuestionForm } from "./edit-question-form"

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: question }, { data: chapters }] = await Promise.all([
    supabase
      .from("questions")
      .select("*, answers(*)")
      .eq("id", id)
      .single(),
    supabase
      .from("chapters")
      .select("id, number, icon")
      .order("number", { ascending: true }),
  ])

  if (!question) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/questions?chapterId=${question.chapter_id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Questions
        </Link>
        <h1 className="text-2xl font-bold">Edit Question</h1>
      </div>
      <EditQuestionForm question={question} chapters={chapters ?? []} />
    </div>
  )
}
