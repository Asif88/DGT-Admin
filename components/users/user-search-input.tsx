"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function UserSearchInput({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams.toString())
      const value = e.target.value.trim()
      if (value) {
        params.set("search", value)
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
        defaultValue={defaultValue}
        onChange={handleChange}
        className="pl-9"
      />
    </div>
  )
}
