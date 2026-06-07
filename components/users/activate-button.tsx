"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { activateUser } from "@/app/(admin)/users/actions"

export function ActivateButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      disabled={isPending}
      className="bg-brand text-white hover:bg-brand/90"
      onClick={() => {
        if (!confirm("Activate this user? They will be able to sign in again.")) return
        startTransition(() => {
          activateUser(id)
        })
      }}
    >
      {isPending ? "Activating..." : "Activate User"}
    </Button>
  )
}
