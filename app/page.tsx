import { LogoutButton } from "@/components/auth/logout-button"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">DGT Admin</h1>
        <p className="text-muted-foreground">Dashboard — próximamente</p>
        <LogoutButton />
      </div>
    </main>
  )
}
