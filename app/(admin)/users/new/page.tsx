"use client"

import { useActionState } from "react"
import Link from "next/link"
import { createUser } from "../actions"
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

export default function NewUserPage() {
  const [error, formAction] = useActionState(createUser, null)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/users"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Users
        </Link>
        <h1 className="text-2xl font-bold">Add User</h1>
      </div>

      <form action={formAction} className="max-w-md space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
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
              required
              className="flex-1"
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
          className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-white"
        >
          Add User
        </Button>
      </form>
    </div>
  )
}
