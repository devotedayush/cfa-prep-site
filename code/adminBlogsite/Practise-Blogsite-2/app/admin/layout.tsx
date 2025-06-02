import type React from "react"
import { AdminHeader } from "@/components/admin-header"
import { SiteFooter } from "@/components/site-footer"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
