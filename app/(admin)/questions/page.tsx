import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const QUESTION_TEXT_MAX_LENGTH = 60

type Chapter = {
  id: string
  number: number
  icon: string
}

type Question = {
  id: string
  order: number
  text: { en?: string; es?: string }
  media_type: "image" | "video" | null
  answers: { count: number }[]
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "…"
}

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ chapterId?: string }>
}) {
  const { chapterId } = await searchParams
  const supabase = await createClient()

  const { data: chapters, error: chaptersError } = await supabase
    .from("chapters")
    .select("id, number, icon")
    .order("number", { ascending: true })

  if (chaptersError) {
    throw new Error(`Failed to load chapters: ${chaptersError.message}`)
  }

  let questionsQuery = supabase
    .from("questions")
    .select('id, "order", text, media_type, answers(count)')
    .order("order", { ascending: true })

  if (chapterId) {
    questionsQuery = questionsQuery.eq("chapter_id", chapterId)
  }

  const { data: questions, error: questionsError } = await questionsQuery

  if (questionsError) {
    throw new Error(`Failed to load questions: ${questionsError.message}`)
  }

  const addQuestionHref = chapterId
    ? `/questions/new?chapterId=${chapterId}`
    : "/questions/new"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Questions</h1>
        <Button nativeButton={false} render={<Link href={addQuestionHref} />}>
          Add Question
        </Button>
      </div>

      {/* Chapter filter pills */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!chapterId ? "default" : "outline"}
          size="sm"
          nativeButton={false}
          render={<Link href="/questions" />}
          className={cn(!chapterId && "bg-brand hover:bg-brand/80")}
        >
          All
        </Button>
        {(chapters as Chapter[]).map((chapter) => {
          const isActive = chapterId === chapter.id
          return (
            <Button
              key={chapter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              nativeButton={false}
              render={<Link href={`/questions?chapterId=${chapter.id}`} />}
              className={cn(isActive && "bg-brand hover:bg-brand/80")}
            >
              {chapter.icon} Ch. {chapter.number}
            </Button>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          {questions && questions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Question (EN)</TableHead>
                  <TableHead className="w-24">Media</TableHead>
                  <TableHead className="w-24">Answers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(questions as Question[]).map((question) => {
                  const questionText =
                    question.text?.en ?? question.text?.es ?? ""
                  const answerCount = question.answers?.[0]?.count ?? 0

                  return (
                    <TableRow key={question.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {question.order}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {truncate(questionText, QUESTION_TEXT_MAX_LENGTH)}
                      </TableCell>
                      <TableCell>
                        {question.media_type === "image" ? (
                          <Badge variant="secondary">Image</Badge>
                        ) : question.media_type === "video" ? (
                          <Badge variant="secondary">Video</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{answerCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            nativeButton={false}
                            render={
                              <Link href={`/questions/${question.id}/edit`} />
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">
                No questions yet. Add the first one.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
