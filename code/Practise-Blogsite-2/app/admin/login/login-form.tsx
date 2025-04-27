"use client" // This makes sure the component runs on the user's browser, not only on the server.

import type React from "react"

import { useState } from "react" // Lets us remember information that can change, like form inputs.
import { useRouter } from "next/navigation" // Lets us move to a different page from our code.
import { Button } from "@/components/ui/button" // A pretty button we made somewhere else.
import { Input } from "@/components/ui/input" // A styled box for users to type stuff in.
import { Label } from "@/components/ui/label" // Text that describes what to type in the box above or below it.
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card" // Boxes to group and style our form.
import { supabase } from "@/lib/supabase" // Our tool for talking to the database and logging in users.

// The actual form users will see and use
export function LoginForm() {
  const router = useRouter() // Helps us move users to new pages.
  // Store what the user types for email and password.
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // Remember if we're waiting for the login to finish.
  const [loading, setLoading] = useState(false)
  // Remember if there's a problem to show the user.
  const [error, setError] = useState<string | null>(null)

  // What we do when the user tries to log in.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Don't let the form reload the page.
    setLoading(true) // Say that we're busy logging in.
    setError(null) // Clear old problems.

    try {
      // Tell Supabase to check if the email and password are okay.
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error // If something went wrong, handle it below.
      }

      await fetch('/api/auth-cookies', {
        method: 'POST',
        body: JSON.stringify({
          name: 'userEmail',      // Example: store user's email in cookie
          value: email,
          options: { path: '/' }
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      router.push("/admin") // Send the user to the admin page if login worked.
      router.refresh() // Update the page info.
    } catch (err: any) {
      // If something went wrong, show the problem to the user.
      setError(err.message || "Failed to sign in")
    } finally {
      setLoading(false) // Say we're done trying to log in.
    }
  }

  // This is what we show on the screen.
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="text-xl font-semibold">Sign In</CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Show the error message if there's a problem */}
          {error && <div className="rounded-md bg-red-500/20 p-3 text-sm text-white">{error}</div>}
          <div className="space-y-2">
            {/* The label and input for the user's email */}
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update the email state when user types
              required
              className="border-white/10 bg-white/5"
            />
          </div>
          <div className="space-y-2">
            {/* The label and input for the user's password */}
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update the password state when user types
              required
              className="border-white/10 bg-white/5"
            />
          </div>
        </CardContent>
        <CardFooter>
          {/* The button to log in - it shows "Signing in..." if we're waiting */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-800 hover:from-emerald-400 hover:to-sky-500"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
