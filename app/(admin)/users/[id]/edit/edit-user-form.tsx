"use client"

import { useActionState } from "react"
import { updateUser } from "@/app/(admin)/users/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function generatePassword(): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("")
}

export function EditUserForm({
  id,
  currentEmail,
}: {
  id: string
  currentEmail: string
}) {
  const [error, formAction] = useActionState(updateUser.bind(null, id), null)

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          defaultValue={currentEmail}
          placeholder="user@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            id="password"
            name="password"
            className="flex-1"
            placeholder="Leave blank to keep unchanged"
          />
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              const form = (e.currentTarget as HTMLButtonElement).closest(
                "form"
              )
              const input = form?.querySelector<HTMLInputElement>(
                'input[name="password"]'
              )
              if (input) input.value = generatePassword()
            }}
          >
            Generate
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive" aria-live="polite">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full sm:w-auto bg-brand text-white hover:bg-brand/90"
      >
        Save Changes
      </Button>
    </form>
  )
}
