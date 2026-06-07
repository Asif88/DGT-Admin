"use client"

import { useActionState, useState } from "react"
import { Check, Plus, Trash2 } from "lucide-react"
import { createQuestion, uploadQuestionMedia } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Chapter = {
  id: string
  number: number
  icon: string
}

type AnswerRow = {
  textEn: string
  textEs: string
}

const MIN_ANSWERS = 2
const MAX_ANSWERS = 4

export function QuestionForm({
  chapters,
  defaultChapterId,
}: {
  chapters: Chapter[]
  defaultChapterId?: string
}) {
  const [error, formAction, isPending] = useActionState(createQuestion, null)

  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError("")
    const fd = new FormData()
    fd.append("file", file)
    const result = await uploadQuestionMedia(fd)
    if ("error" in result) {
      setUploadError(result.error)
    } else {
      setImageUrl(result.url)
    }
    setUploading(false)
  }

  const [answers, setAnswers] = useState<AnswerRow[]>([
    { textEn: "", textEs: "" },
    { textEn: "", textEs: "" },
  ])
  const [correctIndex, setCorrectIndex] = useState<number | null>(null)

  function addAnswer() {
    if (answers.length < MAX_ANSWERS) {
      setAnswers((prev) => [...prev, { textEn: "", textEs: "" }])
    }
  }

  function removeAnswer(index: number) {
    if (answers.length <= MIN_ANSWERS) return
    setAnswers((prev) => prev.filter((_, i) => i !== index))
    setCorrectIndex((prev) => {
      if (prev === null) return null
      if (prev === index) return null
      if (prev > index) return prev - 1
      return prev
    })
  }

  function updateAnswer(index: number, field: "textEn" | "textEs", value: string) {
    setAnswers((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    )
  }

  const inputClass =
    "h-8 w-full min-w-0 rounded-lg border border-oklch(0.922 0 0) bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-oklch(0.556 0 0) focus-visible:border-oklch(0.708 0 0) focus-visible:ring-3 focus-visible:ring-oklch(0.708 0 0)/50 dark:border-oklch(1 0 0 / 10%) dark:placeholder:text-oklch(0.708 0 0) dark:focus-visible:border-oklch(0.556 0 0)"
  const textareaClass =
    "w-full min-w-0 rounded-lg border border-oklch(0.922 0 0) bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-oklch(0.556 0 0) focus-visible:border-oklch(0.708 0 0) focus-visible:ring-3 focus-visible:ring-oklch(0.708 0 0)/50 resize-none dark:border-oklch(1 0 0 / 10%) dark:placeholder:text-oklch(0.708 0 0) dark:focus-visible:border-oklch(0.556 0 0)"
  const selectClass =
    "h-8 w-full rounded-lg border border-oklch(0.922 0 0) bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-oklch(0.708 0 0) focus-visible:ring-3 focus-visible:ring-oklch(0.708 0 0)/50 dark:border-oklch(1 0 0 / 10%) dark:bg-oklch(0.145 0 0)"

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {/* Chapter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chapter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="chapterId">Chapter</Label>
            <select
              id="chapterId"
              name="chapterId"
              required
              defaultValue={defaultChapterId ?? ""}
              className={selectClass}
            >
              <option value="" disabled>
                Select a chapter
              </option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.icon} Chapter {ch.number}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="order">Order</Label>
            <Input
              type="number"
              id="order"
              name="order"
              required
              min={1}
              placeholder="1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Question text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Question Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="textEn">English</Label>
            <textarea
              id="textEn"
              name="textEn"
              required
              rows={3}
              placeholder="Question text in English"
              className={textareaClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="textEs">Spanish</Label>
            <textarea
              id="textEs"
              name="textEs"
              rows={3}
              placeholder="Question text in Spanish"
              className={textareaClass}
            />
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Explanation (optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="explanationEn">English</Label>
            <textarea
              id="explanationEn"
              name="explanationEn"
              rows={3}
              placeholder="Explanation in English"
              className={textareaClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="explanationEs">Spanish</Label>
            <textarea
              id="explanationEs"
              name="explanationEs"
              rows={3}
              placeholder="Explanation in Spanish"
              className={textareaClass}
            />
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Media (optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="imageFile">Image</Label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="block text-sm"
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
            {imageUrl && !uploading && (
              <img src={imageUrl} alt="preview" className="mt-2 h-24 rounded object-cover" />
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input id="videoUrl" name="videoUrl" type="url" placeholder="https://youtube.com/..." />
          </div>
        </CardContent>
      </Card>

      {/* Answers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hidden inputs for answer data */}
          {answers.map((answer, i) => (
            <input
              key={`hidden-en-${i}`}
              type="hidden"
              name={`answerTextEn_${i}`}
              value={answer.textEn}
            />
          ))}
          {answers.map((answer, i) => (
            <input
              key={`hidden-es-${i}`}
              type="hidden"
              name={`answerTextEs_${i}`}
              value={answer.textEs}
            />
          ))}
          {answers.map((_, i) => (
            <input
              key={`hidden-correct-${i}`}
              type="hidden"
              name={`answerCorrect_${i}`}
              value={correctIndex === i ? "true" : "false"}
            />
          ))}

          {answers.map((answer, i) => (
            <div
              key={i}
              className="rounded-lg border border-oklch(0.922 0 0) dark:border-oklch(1 0 0 / 10%) p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Answer {i + 1}
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="correctAnswerRadio"
                      checked={correctIndex === i}
                      onChange={() => setCorrectIndex(i)}
                      className="accent-brand"
                    />
                    Correct
                  </label>
                  <button
                    type="button"
                    onClick={() => removeAnswer(i)}
                    disabled={answers.length <= MIN_ANSWERS}
                    className="text-muted-foreground hover:text-destructive disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Remove answer ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">English</Label>
                  <input
                    type="text"
                    value={answer.textEn}
                    onChange={(e) => updateAnswer(i, "textEn", e.target.value)}
                    placeholder="Answer in English"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Spanish</Label>
                  <input
                    type="text"
                    value={answer.textEs}
                    onChange={(e) => updateAnswer(i, "textEs", e.target.value)}
                    placeholder="Answer in Spanish"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}

          {answers.length < MAX_ANSWERS && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAnswer}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Answer
            </Button>
          )}
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive" aria-live="polite">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="bg-brand hover:bg-brand-dark text-white"
      >
        <Check className="mr-2 h-4 w-4" />
        {isPending ? "Saving…" : "Save Question"}
      </Button>
    </form>
  )
}
