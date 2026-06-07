import Link from "next/link"
import { createChapter } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewChapterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/chapters" className="text-sm text-muted-foreground hover:underline">
          ← Chapters
        </Link>
        <h1 className="text-2xl font-bold">Add Chapter</h1>
      </div>

      <form action={createChapter} className="max-w-md space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="number">Chapter Number</Label>
          <Input type="number" id="number" name="number" required min={1} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" name="icon" required placeholder="🚗" />
        </div>

        <Button type="submit">Save Chapter</Button>
      </form>
    </div>
  )
}
