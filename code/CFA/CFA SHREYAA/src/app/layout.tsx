import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { LayoutDashboard, BookText, PenTool, CheckSquare, Target, Settings, BrainCircuit } from 'lucide-react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'Adaptive CFA Level 1 Dashboard',
  description: 'Personalized CFA Level 1 Preparation Platform',
}

function Sidebar() {
  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Syllabus', href: '/syllabus', icon: BookText },
    { name: 'Revisions', href: '/revisions', icon: CheckSquare },
    { name: 'Assessments', href: '/assessments', icon: BrainCircuit },
    { name: 'Mocks', href: '/mocks', icon: Target },
    { name: 'Notes', href: '/notes', icon: PenTool },
  ]
  return (
    <div className="w-64 h-screen fixed left-0 top-0 border-r border-white/5 bg-background/50 backdrop-blur-xl flex flex-col pt-8 pb-4">
      <div className="px-6 mb-10">
        <h1 className="font-heading font-semibold tracking-tight text-xl flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-sm">CFA</span>
          </div>
          Prep <span className="text-white/50">Pro</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors font-medium"
            >
              <Icon size={18} className="text-primary/70" />
              {link.name}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 mt-auto">
        <Link 
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors font-medium"
        >
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased text-foreground min-h-screen bg-background font-sans`}>
        <div className="flex relative">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 pt-10 min-h-screen pb-24">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
