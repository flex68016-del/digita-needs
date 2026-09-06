"use client"

import { motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { CheckCircle2, Mail, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SurveyCompletionProps {
  participantId: string | null
  onFinish: () => void
}

export function SurveyCompletion({ participantId, onFinish }: SurveyCompletionProps) {
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactInfo, setContactInfo] = useState({
    name: '',
    whatsapp: '',
    email: ''
  })
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => { if (!showContactForm) onFinish() }, 15000)
    return () => clearTimeout(timer)
  }, [showContactForm, onFinish])
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (participantId && supabase) {
      const { error } = await supabase.rpc('update_contact_info', {
        p_participant_id: participantId,
        p_name: contactInfo.name,
        p_whatsapp: contactInfo.whatsapp,
        p_email: contactInfo.email,
      })
      if (error) console.error(error)
    }
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
        {!showContactForm ? (
          <>
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
              
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => setShowContactForm(true)}
                >
                  Oui, je souhaite être informé
                </Button>
                
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onFinish}
                >
                  Retour à l'accueil
                </Button>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-deep-black mb-6"
            >
              Restons en contact
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.1 }}
              className="text-gray-600 mb-8"
            >
              Laissez-nous vos coordonnées pour être informé des solutions adaptées à vos besoins.
            </motion.p>
            
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 0.2 }}
              onSubmit={handleContactSubmit}
              className="space-y-6 text-left"
            >
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom (facultatif)
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-electric-green focus:ring-2 focus:ring-electric-green/20 outline-none transition-all"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label htmlFor="contact-whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                  <input
                    id="contact-whatsapp"
                    type="tel"
                    value={contactInfo.whatsapp}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-electric-green focus:ring-2 focus:ring-electric-green/20 outline-none transition-all"
                    placeholder="+228 XX XX XX XX"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                  <input
                    id="contact-email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-electric-green focus:ring-2 focus:ring-electric-green/20 outline-none transition-all"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-electric-green focus:ring-electric-green"
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  J'accepte d'être contacté pour des informations sur les solutions numériques adaptées à mon activité.
                </label>
              </div>
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowContactForm(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  Envoyer
                </Button>
              </div>
            </motion.form>
          </>
        )}
      </motion.div>
    </div>
  )
}