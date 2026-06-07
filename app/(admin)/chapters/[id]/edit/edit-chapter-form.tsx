"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { updateChapter } from "../../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  id: string
  number: number
  icon: string
}

export default function EditChapterForm({ id, number, icon }: Props) {
  const updateChapterForId = (prevState: string | null, formData: FormData) =>
    updateChapter(id, prevState, formData)
  const [error, formAction] = useActionState(updateChapterForId, null)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/chapters" className="text-sm text-muted-foreground hover:underline">
          ← Chapters
        </Link>
        <h1 className="text-2xl font-bold">Edit Chapter</h1>
      </div>

      <form action={formAction} className="max-w-md space-y-4">
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

        {error && (
          <p className="text-sm text-destructive" aria-live="polite">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white"
        >
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </form>
    </div>
  )
}
