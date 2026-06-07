import Link from "next/link"
import { PlusCircle, Pencil } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
        <Button
          className="bg-brand text-white hover:bg-brand/90"
          nativeButton={false}
          render={<Link href="/chapters/new" />}
        >
          <PlusCircle className="size-4" />
          Add Chapter
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {chapters && chapters.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead className="w-20">Icon</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(chapters as Chapter[]).map((chapter) => {
                  return (
                    <TableRow key={chapter.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{chapter.number}</TableCell>
                      <TableCell className="text-xl">{chapter.icon}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            nativeButton={false}
                            render={<Link href={`/chapters/${chapter.id}/edit`} />}
                          >
                            <Pencil className="size-4" />
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
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">No chapters yet. Add the first one.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
