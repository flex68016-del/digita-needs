"use client"

import { motion } from 'motion/react'

interface ProgressBarProps {
  current: number
  total: number
  percentage?: number
}

export function ProgressBar({ current, total, percentage }: ProgressBarProps) {
  const progress = percentage || ((current / total) * 100)
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white/60">
          {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="text-sm font-medium text-emerald-400">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-emerald-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>
    </div>
  )
}