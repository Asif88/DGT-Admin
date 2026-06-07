import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { QuestionForm } from "./question-form"

export default async function NewQuestionPage({
  searchParams,
}: {
  searchParams: Promise<{ chapterId?: string }>
}) {
  const { chapterId } = await searchParams
  const supabase = await createClient()

  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, number, icon")
    .order("number", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={chapterId ? `/questions?chapterId=${chapterId}` : "/questions"}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Questions
        </Link>
        <h1 className="text-2xl font-bold">Add Question</h1>
      </div>
      <QuestionForm chapters={chapters ?? []} defaultChapterId={chapterId} />
    </div>
  )
}
