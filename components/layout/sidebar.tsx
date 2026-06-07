"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, HelpCircle, Shield, Users } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/chapters", label: "Chapters", icon: BookOpen },
  { href: "/questions", label: "Questions", icon: HelpCircle },
  { href: "/users", label: "Users", icon: Users },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <span className="text-base font-semibold text-brand">DGT Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-l-4 border-brand bg-brand-light pl-2 text-brand"
                  : "border-l-4 border-transparent pl-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-border px-4 py-4">
        <LogoutButton />
      </div>
    </aside>
  )
}
