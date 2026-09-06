"use client"

import { motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SurveyCompletionProps {
  participantId: string | null
  onFinish: () => void
}

export function SurveyCompletion({ participantId, onFinish }: SurveyCompletionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()

  const handleInterested = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    console.log('Marking participant as interested:', { participantId })
    
    if (!participantId) {
      console.error('No participantId provided')
      setSubmitError('Erreur: ID participant manquant')
      setIsSubmitting(false)
      return
    }
    
    if (!supabase) {
      console.error('Supabase client not configured')
      setSubmitError('Erreur: connexion Supabase non configurée')
      setIsSubmitting(false)
      return
    }
    
    try {
      const { data, error } = await supabase.rpc('update_contact_info', {
        p_participant_id: participantId,
        p_name: null,
        p_whatsapp: null,
        p_email: null,
      })
      
      console.log('RPC response:', { data, error })
      
      if (error) {
        console.error('RPC error:', error)
        setSubmitError(`Erreur: ${error.message}`)
        setIsSubmitting(false)
        return
      }
      
      console.log('Participant marked as interested successfully')
      onFinish()
    } catch (err) {
      console.error('Unexpected error:', err)
      setSubmitError('Erreur lors de la soumission')
      setIsSubmitting(false)
    }
  }

  const handleNotInterested = () => {
    onFinish()
  }
  
  const motionProps = reducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 }
  } : {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 }
  }
  
  return (
    <div className="min-h-[100dvh] bg-off-white flex items-center justify-center p-6">
      <motion.div
        {...motionProps}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: reducedMotion ? 0 : 0.2, type: reducedMotion ? undefined : "spring", stiffness: reducedMotion ? undefined : 200 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-electric-green/10 flex items-center justify-center"
          aria-hidden="true"
        >
          <CheckCircle2 className="w-10 h-10 text-electric-green" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.3 }}
          className="text-4xl md:text-5xl font-bold text-deep-black mb-6"
        >
          Merci.
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reducedMotion ? 0 : 0.4 }}
          className="text-xl text-gray-600 mb-12 leading-relaxed"
        >
          Votre réponse contribue à mieux comprendre les besoins numériques des professionnels.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.5 }}
          className="bg-white p-8 rounded-2xl border border-gray-100 mb-8"
        >
          <h3 className="text-xl font-semibold text-deep-black mb-4">
            Souhaitez-vous être informé lorsqu'une solution correspondant à vos besoins sera disponible ?
          </h3>
          
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-4">
              {submitError}
            </div>
          )}
          
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={handleInterested}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Oui, je souhaite être informé'}
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={handleNotInterested}
            >
              Non, retour à l'accueil
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}