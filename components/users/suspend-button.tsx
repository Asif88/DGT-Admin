"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { suspendUser } from "@/app/(admin)/users/actions"

export function SuspendButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      className="bg-orange-500 hover:bg-orange-600 text-white"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Suspend this user? They will not be able to sign in.")) return
        startTransition(() => {
          suspendUser(id)
        })
      }}
    >
      {isPending ? "Suspending..." : "Suspend User"}
    </Button>
  )
}
