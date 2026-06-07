"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { deleteChapter } from "@/app/(admin)/chapters/actions"

export function DeleteChapterButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Delete this chapter? This cannot be undone.")) return
    startTransition(() => {
      deleteChapter(id)
    })
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  )
}
