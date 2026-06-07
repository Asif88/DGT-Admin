"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/service"

export async function createQuestion(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const chapterId = String(formData.get("chapterId"))
  const order = Number(formData.get("order"))
  const textEn = String(formData.get("textEn")).trim()
  const textEs = String(formData.get("textEs")).trim()
  const explanationEn = String(formData.get("explanationEn") ?? "").trim()
  const explanationEs = String(formData.get("explanationEs") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null
  const videoUrl = String(formData.get("videoUrl") ?? "").trim() || null

  // Parse answers: answerTextEn_0, answerTextEs_0, answerCorrect_0, ...
  const answers: {
    textEn: string
    textEs: string
    isCorrect: boolean
    order: number
  }[] = []
  let i = 0
  while (formData.get(`answerTextEn_${i}`) !== null) {
    answers.push({
      textEn: String(formData.get(`answerTextEn_${i}`)).trim(),
      textEs: String(formData.get(`answerTextEs_${i}`) ?? "").trim(),
      isCorrect: formData.get(`answerCorrect_${i}`) === "true",
      order: i,
    })
    i++
  }

  if (answers.length < 2) return "At least 2 answers are required."
  if (!answers.some((a) => a.isCorrect)) return "At least one answer must be correct."

  const supabase = createServiceClient()

  const { data: question, error: qError } = await supabase
    .from("questions")
    .insert({
      chapter_id: chapterId,
      order,
      text: { en: textEn, es: textEs },
      explanation:
        explanationEn || explanationEs
          ? { en: explanationEn, es: explanationEs }
          : null,
      image_url: imageUrl,
      video_url: videoUrl,
    })
    .select("id")
    .single()

  if (qError) return qError.message

  const { error: aError } = await supabase.from("answers").insert(
    answers.map((a) => ({
      question_id: question.id,
      text: { en: a.textEn, es: a.textEs },
      is_correct: a.isCorrect,
      order: a.order,
    }))
  )

  if (aError) return aError.message

  const redirectUrl = `/questions?chapterId=${chapterId}`
  redirect(redirectUrl)
}

export async function updateQuestion(
  id: string,
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const chapterId = String(formData.get("chapterId"))
  const order = Number(formData.get("order"))
  const textEn = String(formData.get("textEn")).trim()
  const textEs = String(formData.get("textEs")).trim()
  const explanationEn = String(formData.get("explanationEn") ?? "").trim()
  const explanationEs = String(formData.get("explanationEs") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null
  const videoUrl = String(formData.get("videoUrl") ?? "").trim() || null

  // Parse answers: answerTextEn_0, answerTextEs_0, answerCorrect_0, ...
  const answers: {
    textEn: string
    textEs: string
    isCorrect: boolean
    order: number
  }[] = []
  let i = 0
  while (formData.get(`answerTextEn_${i}`) !== null) {
    answers.push({
      textEn: String(formData.get(`answerTextEn_${i}`)).trim(),
      textEs: String(formData.get(`answerTextEs_${i}`) ?? "").trim(),
      isCorrect: formData.get(`answerCorrect_${i}`) === "true",
      order: i,
    })
    i++
  }

  if (answers.length < 2) return "At least 2 answers are required."
  if (!answers.some((a) => a.isCorrect)) return "At least one answer must be correct."

  const supabase = createServiceClient()

  const { error: qError } = await supabase
    .from("questions")
    .update({
      chapter_id: chapterId,
      order,
      text: { en: textEn, es: textEs },
      explanation:
        explanationEn || explanationEs
          ? { en: explanationEn, es: explanationEs }
          : null,
      image_url: imageUrl,
      video_url: videoUrl,
    })
    .eq("id", id)

  if (qError) return qError.message

  // Replace all answers: delete existing then insert new set
  const { error: dError } = await supabase
    .from("answers")
    .delete()
    .eq("question_id", id)

  if (dError) return dError.message

  const { error: aError } = await supabase.from("answers").insert(
    answers.map((a) => ({
      question_id: id,
      text: { en: a.textEn, es: a.textEs },
      is_correct: a.isCorrect,
      order: a.order,
    }))
  )

  if (aError) return aError.message

  const redirectUrl = `/questions?chapterId=${chapterId}`
  redirect(redirectUrl)
}

export async function uploadQuestionMedia(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file") as File
  if (!file) return { error: "No file provided" }

  const ext = file.name.split(".").pop()
  const path = `${crypto.randomUUID()}.${ext}`

  const supabase = createServiceClient()
  const { error } = await supabase.storage
    .from("question-media")
    .upload(path, file, { contentType: file.type })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from("question-media").getPublicUrl(path)
  return { url: data.publicUrl }
}

export async function deleteQuestion(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from("questions").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/questions")
}
