"use client"

import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { ChevronRight, Check } from 'lucide-react'

interface SurveyStepProps {
  step: number
  totalSteps: number
  title: string
  subtitle?: string
  options: Array<{
    id: string
    label: string
    icon?: React.ReactNode
    description?: string
  }>
  multiSelect?: boolean
  onSelect: (selected: string | string[]) => void
  onBack?: () => void
}

export function SurveyStep({
  step,
  totalSteps,
  title,
  subtitle,
  options,
  multiSelect = false,
  onSelect,
  onBack
}: SurveyStepProps) {
  const [selected, setSelected] = useState<string | string[]>(multiSelect ? [] : '')
  const reducedMotion = useReducedMotion()
  
  const handleSelect = (id: string) => {
    if (multiSelect) {
      const current = selected as string[]
      const newSelected = current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
      setSelected(newSelected)
      // Auto-submit on selection for multi-select
      if (newSelected.length > 0) {
        onSelect(newSelected)
      }
    } else {
      setSelected(id)
      onSelect(id)
    }
  }
  
  const handleContinue = () => {
    if (multiSelect && (selected as string[]).length > 0) {
      onSelect(selected)
    }
  }
  
  const motionProps = reducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  } : {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.5 }
  }
  
  return (
    <motion.div
      {...motionProps}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reducedMotion ? 0 : 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="text-sm font-medium text-electric-green mb-4 uppercase tracking-[0.15em]"
        >
          ÉTAPE {step} / {totalSteps}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="text-4xl md:text-5xl font-bold text-deep-black mb-4 leading-tight tracking-tight"
        >
          {title}
        </motion.h2>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reducedMotion ? 0 : 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="text-lg text-graphite max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" role="radiogroup" aria-label={title}>
        {options.map((option, index) => {
          const isSelected = multiSelect
            ? (selected as string[]).includes(option.id)
            : selected === option.id
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 0.1 * index + 0.5, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => handleSelect(option.id)}
              aria-pressed={isSelected}
              aria-label={option.label}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-electric-green focus:ring-offset-2
                ${isSelected
                  ? 'border-electric-green bg-electric-green/5'
                  : 'border-black/10 hover:border-black/20 bg-white'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {option.icon && (
                    <div className="mb-3 text-electric-green" aria-hidden="true">
                      {option.icon}
                    </div>
                  )}
                  <div className="font-semibold text-deep-black mb-1">
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-sm text-graphite">
                      {option.description}
                    </div>
                  )}
                </div>
                
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-electric-green flex items-center justify-center flex-shrink-0 ml-4" aria-hidden="true">
                    <Check className="w-4 h-4 text-deep-black" />
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
      
      {multiSelect && (selected as string[]).length > 0 && onBack && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.32, 0.72, 0, 1] }}
        >
          <button
            onClick={onBack}
            className="text-graphite hover:text-deep-black transition-colors focus:outline-none focus:ring-2 focus:ring-electric-green rounded px-2 py-1"
          >
            Retour
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}