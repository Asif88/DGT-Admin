import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { DeleteChapterButton } from "@/components/chapters/delete-chapter-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Chapter = {
  id: string
  number: number
  icon: string
}

export default async function ChaptersPage() {
  const supabase = await createClient()

  const { data: chapters, error } = await supabase
    .from("chapters")
    .select("id, number, icon")
    .order("number", { ascending: true })

  if (error) {
    throw new Error(`Failed to load chapters: ${error.message}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chapters</h1>
        <Button nativeButton={false} render={<Link href="/chapters/new" />}>Add Chapter</Button>
      </div>

      {chapters && chapters.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(chapters as Chapter[]).map((chapter) => {
              return (
                <TableRow key={chapter.id}>
                  <TableCell>{chapter.number}</TableCell>
                  <TableCell>{chapter.icon}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/chapters/${chapter.id}/edit`} />}
                      >
                        Edit
                      </Button>
                      <DeleteChapterButton id={chapter.id} />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground">
          No chapters yet. Add the first one.
        </p>
      )}
    </div>
  )
}
