"use client"

import { useRouter } from "next/navigation"

type Chapter = { id: string; number: number; icon: string }

export function ChapterFilter({
  chapters,
  selectedChapterId,
}: {
  chapters: Chapter[]
  selectedChapterId?: string
}) {
  const router = useRouter()

  const selectClass =
    "h-8 w-[200px] rounded-lg border border-oklch(0.922 0 0) bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-oklch(0.708 0 0) focus-visible:ring-3 focus-visible:ring-oklch(0.708 0 0)/50 dark:border-oklch(1 0 0 / 10%) dark:bg-oklch(0.145 0 0)"

  return (
    <select
      value={selectedChapterId ?? "all"}
      onChange={(e) => {
        router.push(
          e.target.value === "all"
            ? "/questions"
            : `/questions?chapterId=${e.target.value}`
        )
      }}
      className={selectClass}
    >
      <option value="all">All chapters</option>
      {chapters.map((chapter) => (
        <option key={chapter.id} value={chapter.id}>
          {chapter.icon} Chapter {chapter.number}
        </option>
      ))}
    </select>
  )
}
