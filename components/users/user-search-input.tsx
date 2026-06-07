"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function UserSearchInput({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue ?? "")

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value
      setValue(next)
      const params = new URLSearchParams(searchParams.toString())
      if (next.trim()) {
        params.set("search", next.trim())
      } else {
        params.delete("search")
      }
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  return (
    <div className="relative w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder="Search by email…"
        value={value}
        onChange={handleChange}
        className="pl-9"
      />
    </div>
  )
}
