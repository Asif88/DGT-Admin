"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { deleteUser } from "@/app/(admin)/users/actions"

export function DeleteUserButton({ id }: { id: string }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!showConfirm) {
    return (
      <Button
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={() => setShowConfirm(true)}
      >
        Delete User
      </Button>
    )
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
      <p className="text-sm font-medium text-red-800">
        Are you sure you want to delete this user? This action cannot be undone.
      </p>
      <div className="flex gap-2">
        <Button
          className="bg-red-600 hover:bg-red-700 text-white"
          disabled={isPending}
          onClick={() => startTransition(() => deleteUser(id))}
        >
          {isPending ? "Deleting..." : "Yes, Delete"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
