"use client"

import { motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { NetworkAnimation } from '@/components/network-animation'
import { StorytellingSection } from '@/components/storytelling-section'
import { SurveyCompletion } from '@/components/survey-completion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SurveyStep } from '@/components/survey-step'
import { ProgressBar } from '@/components/ui/progress-bar'
import { supabase } from '@/lib/supabase'

const surveySteps = [
  {
    title: "Parlez-nous de vous",
    subtitle: "Commençons par comprendre votre profil et votre activité",
    options: [
      { id: "commerce", label: "Commerce", icon: "🏪" },
      { id: "agriculture", label: "Agriculture", icon: "🌾" },
      { id: "elevage", label: "Élevage", icon: "🐄" },
      { id: "restauration", label: "Restauration", icon: "🍽️" },
      { id: "mode", label: "Mode", icon: "👗" },
      { id: "beaute", label: "Beauté", icon: "💄" },
      { id: "transport", label: "Transport", icon: "🚗" },
      { id: "immobilier", label: "Immobilier", icon: "🏠" },
      { id: "formation", label: "Formation", icon: "📚" },
      { id: "services", label: "Services", icon: "🔧" },
      { id: "artisanat", label: "Artisanat", icon: "🔨" },
      { id: "sante", label: "Santé", icon: "🏥" },
      { id: "btp", label: "BTP", icon: "🏗️" },
      { id: "technologie", label: "Technologie", icon: "💻" },
      { id: "autre", label: "Autre", icon: "📋" }
    ]
  },
  {
    title: "Comment trouvez-vous vos clients ?",
    subtitle: "Quels canaux utilisez-vous actuellement pour attirer de nouveaux clients",
    options: [
      { id: "bouche_a_oreille", label: "Bouche-à-oreille" },
      { id: "whatsapp", label: "WhatsApp" },
      { id: "facebook", label: "Facebook" },
      { id: "instagram", label: "Instagram" },
      { id: "tiktok", label: "TikTok" },
      { id: "google", label: "Google" },
      { id: "site_internet", label: "Site internet" },
      { id: "boutique_physique", label: "Boutique physique" },
      { id: "agents", label: "Agents/Commerciaux" },
      { id: "autre", label: "Autre" }
    ]
  },
  {
    title: "Quels outils numériques utilisez-vous ?",
    subtitle: "Sélectionnez tous les outils que vous utilisez actuellement",
    options: [
      { id: "whatsapp_business", label: "WhatsApp Business" },
      { id: "facebook", label: "Facebook" },
      { id: "instagram", label: "Instagram" },
      { id: "tiktok", label: "TikTok" },
      { id: "site_web", label: "Site web" },
      { id: "google_business", label: "Google Business" },
      { id: "boutique_en_ligne", label: "Boutique en ligne" },
      { id: "logiciel_gestion", label: "Logiciel de gestion" },
      { id: "crm", label: "CRM" },
      { id: "comptabilite", label: "Comptabilité" },
      { id: "facturation", label: "Facturation" },
      { id: "paiement_en_ligne", label: "Paiement en ligne" },
      { id: "ia", label: "Intelligence artificielle" },
      { id: "aucun", label: "Aucun" }
    ],
    multiSelect: true
  },
  {
    title: "Quel est votre plus grand défi aujourd'hui ?",
    subtitle: "Qu'est-ce qui vous freine le plus dans votre activité",
    options: [
      { id: "trouver_clients", label: "Trouver des clients" },
      { id: "fideliser", label: "Fidéliser les clients" },
      { id: "faire_connaitre", label: "Faire connaître mon activité" },
      { id: "gerer_commandes", label: "Gérer les commandes" },
      { id: "gerer_stocks", label: "Gérer les stocks" },
      { id: "gerer_finances", label: "Gérer mes finances" },
      { id: "factures", label: "Faire mes factures" },
      { id: "organiser_equipe", label: "Organiser mon équipe" },
      { id: "communiquer", label: "Communiquer avec les clients" },
      { id: "recevoir_paiements", label: "Recevoir les paiements" },
      { id: "visible_internet", label: "Être visible sur Internet" },
      { id: "gagner_temps", label: "Gagner du temps" },
      { id: "outils_numeriques", label: "Je ne sais pas utiliser les outils numériques" },
      { id: "autre", label: "Autre" }
    ]
  },
  {
    title: "Quelle solution numérique vous aiderait le plus ?",
    subtitle: "Si le numérique pouvait résoudre un problème, lequel choisiriez-vous",
    options: [
      { id: "site_internet", label: "Site internet" },
      { id: "boutique_en_ligne", label: "Boutique en ligne" },
      { id: "application_mobile", label: "Application mobile" },
      { id: "gestion_clients", label: "Gestion clients" },
      { id: "gestion_stocks", label: "Gestion stocks" },
      { id: "facturation", label: "Facturation" },
      { id: "comptabilite", label: "Comptabilité" },
      { id: "reservation", label: "Réservation" },
      { id: "paiement_en_ligne", label: "Paiement en ligne" },
      { id: "marketing_digital", label: "Marketing digital" },
      { id: "gestion_reseaux_sociaux", label: "Gestion réseaux sociaux" },
      { id: "automatisation", label: "Automatisation" },
      { id: "ia", label: "Intelligence artificielle" },
      { id: "formation", label: "Formation numérique" }
    ]
  },
  {
    title: "Seriez-vous prêt à investir ?",
    subtitle: "Seriez-vous prêt à investir dans une solution qui résout ce problème",
    options: [
      { id: "oui", label: "Oui" },
      { id: "peut_etre", label: "Peut-être" },
      { id: "besoin_info", label: "Je souhaite d'abord en savoir plus" },
      { id: "non", label: "Non" }
    ]
  }
]

export default function Home() {
  const [showSurvey, setShowSurvey] = useState(false)
  const [surveyComplete, setSurveyComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<number, string | string[]>>({})
  const reducedMotion = useReducedMotion()
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSurvey && !surveyComplete) {
        if (e.key === 'Escape' && currentStep > 0) {
          handleBack()
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSurvey, surveyComplete, currentStep])
  
  const handleStartSurvey = () => {
    setShowSurvey(true)
  }
  
  const handleStepComplete = async (selected: string | string[]) => {
    const updatedResponses = { ...responses, [currentStep]: selected }
    setResponses(updatedResponses)

    if (currentStep < surveySteps.length - 1) {
      setCurrentStep(prev => prev + 1)
      return
    }

    setSurveyComplete(true)

    if (!supabase) {
      console.error('Supabase non configuré : vérifier .env.local')
      return
    }

    const { data, error } = await supabase.rpc('submit_survey', {
      p_name: null,
      p_city: null,
      p_age_range: null,
      p_main_activity: updatedResponses[0] as string,
      p_activity_years: null,
      p_whatsapp: null,
      p_email: null,
      p_contact_consent: false,
      p_acquisition_methods: [updatedResponses[1] as string],
      p_digital_tools: updatedResponses[2] as string[],
      p_challenges: [updatedResponses[3] as string],
      p_digital_needs: [updatedResponses[4] as string],
      p_willing_to_invest: updatedResponses[5] as string,
      p_budget_range: null,
    })

    if (error) {
      console.error('Erreur soumission sondage:', error)
      return
    }
    // data[0] = { participant_id, opportunity_score, opportunity_level }
    // à transmettre à SurveyCompletion si on veut afficher un retour personnalisé
  }
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  if (surveyComplete) {
    return <SurveyCompletion />
  }
  
  if (showSurvey) {
    return (
      <div className="min-h-[100dvh] bg-off-white flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full">
            <ProgressBar current={currentStep + 1} total={surveySteps.length} />
            
            <div className="mt-8">
              <SurveyStep
                step={currentStep + 1}
                totalSteps={surveySteps.length}
                {...surveySteps[currentStep]}
                onSelect={handleStepComplete}
                onBack={handleBack}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <main className="min-h-screen bg-off-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="min-h-[100dvh] relative overflow-hidden">
        <NetworkAnimation />
        
        <div className="relative z-10 min-h-[100dvh] flex flex-col">
          {/* Hero Content */}
          <div className="p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0.3 : 0.8, delay: reducedMotion ? 0 : 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="max-w-4xl mx-auto text-center mt-32"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-deep-black mb-6 leading-tight tracking-tight">
                Comprendre les activités.
                <br />
                Révéler les opportunités.
              </h1>
              
              <p className="text-xl md:text-2xl text-graphite mb-12 max-w-2xl mx-auto leading-relaxed">
                Nous cherchons à comprendre comment les professionnels et entrepreneurs travaillent aujourd'hui, quels défis ils rencontrent et comment le numérique pourrait transformer leur activité.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button
                  size="lg"
                  onClick={handleStartSurvey}
                  icon={<ArrowRight className="w-5 h-5" aria-hidden="true" />}
                >
                  Participer à l'étude
                </Button>
                
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => window.location.href = '/about'}
                >
                  Pourquoi cette étude ?
                </Button>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reducedMotion ? 0 : 1, ease: [0.32, 0.72, 0, 1] }}
                className="flex items-center justify-center gap-6 text-sm text-graphite"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-green" aria-hidden="true" />
                  5 minutes
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-green" aria-hidden="true" />
                  Gratuit
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-green" aria-hidden="true" />
                  Vos réponses sont confidentielles
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Storytelling Section */}
      <StorytellingSection />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}