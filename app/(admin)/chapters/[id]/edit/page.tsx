import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { updateChapter } from "../../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Chapter = {
  id: string
  number: number
  icon: string
  translations: {
    en?: { name?: string }
    es?: { name?: string }
  }
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
    .select("id, number, icon, translations")
    .eq("id", id)
    .single()

  if (!chapter) {
    notFound()
  }

  const { number, icon, translations } = chapter as Chapter
  const nameEn = translations?.en?.name ?? ""
  const nameEs = translations?.es?.name ?? ""

  const boundUpdate = updateChapter.bind(null, id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/chapters" className="text-sm text-muted-foreground hover:underline">
          ← Chapters
        </Link>
        <h1 className="text-2xl font-bold">Edit Chapter</h1>
      </div>

      <form action={boundUpdate} className="max-w-md space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="number">Chapter Number</Label>
          <Input
            type="number"
            id="number"
            name="number"
            required
            min={1}
            defaultValue={number}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" name="icon" required placeholder="🚗" defaultValue={icon} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="nameEn">Name (English)</Label>
          <Input id="nameEn" name="nameEn" required defaultValue={nameEn} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="nameEs">Name (Spanish)</Label>
          <Input id="nameEs" name="nameEs" required defaultValue={nameEs} />
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  )
}
