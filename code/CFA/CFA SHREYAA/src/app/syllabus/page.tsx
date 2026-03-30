"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Play, Layers, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const mockSyllabus = [
  {
    subject: "Quantitative Methods",
    weight: "8-12%",
    topics: [
      {
        title: "Time Value of Money",
        subtopics: [
          { name: "Interest Rates", status: "mastered", ai_mastery: 4.8 },
          { name: "Future Value of Single Cash Flow", status: "completed once", ai_mastery: 3.5 },
          { name: "Present Value of Series of Cash Flows", status: "weak", ai_mastery: 1.8 }
        ]
      },
      {
        title: "Probability Concepts",
        subtopics: [
          { name: "Random Variables", status: "in progress", ai_mastery: 0 },
          { name: "Expected Value and Variance", status: "not started", ai_mastery: 0 }
        ]
      }
    ]
  },
  {
    subject: "Economics",
    weight: "8-12%",
    topics: [
      {
        title: "Microeconomics",
        subtopics: [
          { name: "Demand and Supply Analysis", status: "not started", ai_mastery: 0 },
          { name: "Firm and Market Structures", status: "not started", ai_mastery: 0 }
        ]
      }
    ]
  }
]

type Subtopic = {
  name: string
  status: string
  ai_mastery: number
}

type Topic = {
  title: string
  subtopics: Subtopic[]
}

type Subject = {
  subject: string
  weight: string
  topics: Topic[]
}

function StatusBadge({ status, score }: { status: string, score: number }) {
  const map: Record<string, string> = {
    'mastered': 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    'completed once': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    'in progress': 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    'weak': 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    'not started': 'bg-white/5 border-white/10 text-white/40'
  }

  return (
    <div className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1", map[status] || map['not started'])}>
      {status}
      {score > 0 && <span className="opacity-70 ml-1">AI: {score}</span>}
    </div>
  )
}

function TopicRow({ topic }: { topic: Topic }) {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="border-t border-white/5 first:border-0">
      <div 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between py-4 px-4 hover:bg-white/5 cursor-pointer transition-colors"
      >
        <div className="flex flex-row items-center gap-3">
          <div className="text-white/40">
            {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
          <h3 className="font-medium text-white">{topic.title}</h3>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
           {topic.subtopics.length} Modules
        </div>
      </div>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/20"
          >
            {topic.subtopics.map((sub: Subtopic, i: number) => (
              <div key={i} className="flex items-center justify-between py-3 pl-12 pr-6 border-t border-white/5 hover:bg-white/5 group">
                 <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                   <span className={sub.status === 'not started' ? "text-white/60" : "text-white"}>{sub.name}</span>
                 </div>
                 <div className="flex flex-row items-center gap-4">
                   <StatusBadge status={sub.status} score={sub.ai_mastery} />
                   <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-primary/20 text-primary rounded outline-none hover:bg-primary/40">
                     <Play size={14} fill="currentColor" />
                   </button>
                 </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SyllabusPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2 tracking-tight">
          Syllabus Explorer
        </h1>
        <p className="text-muted-foreground text-lg">
          Track coverage and pinpoint weaknesses systematically.
        </p>
      </div>

      <div className="space-y-6">
        {mockSyllabus.map((subject: Subject, idx) => (
          <div key={idx} className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-card/80 to-background flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <Layers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-white mb-1">{subject.subject}</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Star size={14} className="text-amber-400" /> Exam Weight: {subject.weight}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                 <span className="text-sm font-bold text-white">45% Covered</span>
              </div>
            </div>
            
            <div className="flex flex-col">
               {subject.topics.map((t, i) => (
                 <TopicRow key={i} topic={t} />
               ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
