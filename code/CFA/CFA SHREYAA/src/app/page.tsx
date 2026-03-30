"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, ChevronRight, Clock, Brain, BookOpen, Target, CalendarDays, Flame } from 'lucide-react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { format, addDays } from 'date-fns'
import { cn } from '@/lib/utils'

// Dummy Data mapped to CFA Level 1 themes
const readinessData = [
  { day: 'Day 1', score: 30 },
  { day: 'Day 5', score: 34 },
  { day: 'Day 10', score: 42 },
  { day: 'Day 15', score: 55 },
  { day: 'Today', score: 68 },
]

export default function Dashboard() {
  const daysLeft = 48
  const examDate = useMemo(() => addDays(new Date(), daysLeft), [daysLeft])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-10"
    >
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2 tracking-tight">
            Ready to crush it today?
          </h1>
          <p className="text-muted-foreground text-lg">
            You&apos;re mathematically on track. Stay focused, stay consistent.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-panel px-6 py-4 rounded-2xl flex flex-col items-end border border-white/5 bg-gradient-to-br from-card/60 to-background/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <span className="text-sm font-medium text-white/50 mb-1 flex items-center gap-2 z-10">
              <CalendarDays size={16} /> Days Left
            </span>
            <span className="text-4xl font-heading font-bold text-gradient z-10">{daysLeft}</span>
            <span className="text-xs text-white/40 mt-1 z-10">{format(examDate, 'MMMM do, yyyy')}</span>
          </div>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Readiness Score Card */}
        <div className="glass-panel p-6 rounded-2xl col-span-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent object-cover z-0" />
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-heading font-semibold flex items-center gap-2 mb-1">
                <Target className="text-primary" size={20} /> Exam Readiness
              </h2>
              <p className="text-sm text-muted-foreground">Composite of coverage, AI mastery & mock results</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-heading font-bold text-white">68%</p>
              <p className="text-sm text-emerald-400 font-medium">+4% from last week</p>
            </div>
          </div>
          
          <div className="h-[120px] w-full relative z-10 -ml-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={120}>
              <AreaChart data={readinessData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Action Engine */}
        <div className="glass-panel p-6 rounded-2xl bg-gradient-to-b from-card/80 to-background flex flex-col justify-between border-white/10 hover:border-primary/30 transition-colors shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="text-orange-400" size={22} />
              <h2 className="text-lg font-heading font-semibold">Next Best Action</h2>
            </div>
            <p className="text-sm text-foreground/60 mb-6">Optimized for your time constraints</p>
            
            <div className="space-y-3">
              <div className="bg-primary/20 bg-opacity-20 border border-primary/30 rounded-xl p-4 cursor-pointer hover:bg-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Revision Due</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-300 font-bold border border-red-500/20">Overdue</span>
                </div>
                <h3 className="font-semibold text-white">Fixed-Income Duration</h3>
                <p className="text-xs text-white/50 mt-1 flex items-center gap-1"><Clock size={12}/> Est. 35 mins</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-white text-black py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Start Session <ChevronRight size={18} />
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Priority Plan */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" size={20} /> Today&apos;s Plan
            </h2>
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/70">2/5 Tasks Left</span>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Probability Concepts', type: 'New Learning', icon: BookOpen, status: 'pending', time: '60m' },
              { title: 'Time Value of Money (TVM)', type: 'Quiz AI Eval', icon: Brain, status: 'pending', time: '20m' },
              { title: 'Market Organization & Structure', type: 'Revision', icon: CheckCircle2, status: 'done', time: '30m' },
            ].map((task, i) => (
              <div key={i} className={cn(
                "p-4 rounded-xl border flex items-center justify-between transition-all group hover:bg-white/5",
                task.status === 'done' ? "border-emerald-500/20 bg-emerald-500/5 opacity-50" : "border-white/10 bg-card/40"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    task.status === 'done' ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/20 text-primary"
                  )}>
                    <task.icon size={18} />
                  </div>
                  <div>
                    <h4 className={cn("font-medium", task.status === 'done' ? "line-through text-white/50" : "text-white")}>{task.title}</h4>
                    <p className="text-xs text-white/40 mt-0.5">{task.type}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-white/50">
                  {task.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topic Heatmap / Risk Zones */}
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
          <h2 className="text-lg font-heading font-semibold flex items-center gap-2 mb-1">
            <AlertCircle className="text-rose-400" size={20} /> Risk Zones
          </h2>
          <p className="text-sm text-muted-foreground mb-6">Topics with low AI mastery or overdue revisions</p>
          
          <div className="flex-1 space-y-4">
             {[
              { title: 'Alternative Investments', confidence: 2.1, weight: 'High' },
              { title: 'Ethical and Professional Standards', confidence: 3.4, weight: 'Highest' },
              { title: 'Cash Flow Statements', confidence: 2.8, weight: 'Medium' },
            ].map((risk, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-colors flex justify-between items-center cursor-pointer">
                <div>
                  <h4 className="font-medium text-white mb-1">{risk.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span className="flex items-center gap-1">Mastery: <span className="text-rose-300 font-bold">{risk.confidence}/5</span></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">Exam Weight: <span className="text-amber-300 font-bold">{risk.weight}</span></span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </motion.div>
  )
}
