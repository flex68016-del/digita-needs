"use client"

import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

const steps = [
  { id: 'activity', label: 'ACTIVITÉ', description: 'Ce que vous faites' },
  { id: 'problem', label: 'PROBLÈME', description: 'Ce qui vous freine' },
  { id: 'need', label: 'BESOIN', description: 'Ce dont vous avez besoin' },
  { id: 'solution', label: 'SOLUTION NUMÉRIQUE', description: 'Comment la technologie peut aider' },
  { id: 'opportunity', label: 'OPPORTUNITÉ', description: 'Un nouveau marché à explorer' }
]

export function StorytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  const motionProps = reducedMotion ? {
    style: { opacity: 1, scale: 1 }
  } : {
    style: { scale, opacity }
  }
  
  return (
    <section ref={containerRef} className="min-h-screen bg-[#050505] py-24 md:py-32 flex items-center justify-center relative overflow-hidden" aria-label="Processus de transformation numérique">
      {/* Radial gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[80px]" />
      </div>
      
      <motion.div
        {...motionProps}
        className="relative z-10 max-w-6xl mx-auto px-6 w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0.2 : 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            PROCESSUS
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Chaque activité cache un problème.
            <br />
            Chaque problème peut devenir une opportunité.
          </h2>
        </motion.div>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-emerald-500 via-purple-500 to-emerald-500 opacity-20" aria-hidden="true" />
          
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: reducedMotion ? 0.2 : 0.6, delay: reducedMotion ? 0 : index * 0.1, ease: [0.32, 0.72, 0, 1] }}
                className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'pr-8 md:pr-16' : 'pl-8 md:pl-16'}`}>
                  {/* Double-Bezel Card */}
                  <div className="bg-white/5 rounded-[2rem] p-1.5 border border-white/10">
                    <div className="bg-black/40 rounded-[calc(2rem-0.375rem)] p-6 md:p-8 backdrop-blur-2xl">
                      <div className="text-emerald-400 text-sm font-medium mb-3 uppercase tracking-[0.15em]">
                        {step.label}
                      </div>
                      <div className="text-white text-xl md:text-2xl font-semibold">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dot on the line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" aria-hidden="true" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}