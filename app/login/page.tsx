"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

function AccessDeniedBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("error") !== "access_denied") return null;
  return (
    <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive text-center">
      You do not have permission to access the admin panel.
    </p>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-[400px] shadow-lg">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-brand">DGT Admin</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Access the administration panel
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Suspense>
            <AccessDeniedBanner />
          </Suspense>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            {error && (
              <p className={cn("text-sm text-red-600")}>{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
