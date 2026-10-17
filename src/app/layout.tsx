import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'CFA Prep Pro — Adaptive CFA Preparation',
  description: 'Adaptive, AI-powered preparation for CFA Levels I, II and III.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased text-foreground min-h-screen bg-background font-sans`}
      >
        {children}
      </body>
    </html>
  )
}
