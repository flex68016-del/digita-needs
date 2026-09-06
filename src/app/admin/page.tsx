"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import { Download, Filter, TrendingUp, Users, Building, MapPin, Target, AlertCircle, LogOut, X } from 'lucide-react'

// Dynamic export to prevent static generation
export const dynamic = 'force-dynamic'

const COLORS = ['#18C77A', '#3157FF', '#6B7280', '#F59E0B', '#EF4444']

// Mapping IDs to labels for display
const digitalToolsLabels: Record<string, string> = {
  whatsapp_business: 'WhatsApp Business',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  site_web: 'Site web',
  google_business: 'Google Business',
  boutique_en_ligne: 'Boutique en ligne',
  logiciel_gestion: 'Logiciel de gestion',
  crm: 'CRM',
  comptabilite: 'Comptabilité',
  facturation: 'Facturation',
  paiement_en_ligne: 'Paiement en ligne',
  ia: 'Intelligence artificielle',
  aucun: 'Aucun'
}

const challengesLabels: Record<string, string> = {
  trouver_clients: 'Trouver des clients',
  fideliser: 'Fidéliser les clients',
  faire_connaitre: 'Faire connaître mon activité',
  gerer_commandes: 'Gérer les commandes',
  gerer_stocks: 'Gérer les stocks',
  gerer_finances: 'Gérer mes finances',
  factures: 'Faire mes factures',
  organiser_equipe: 'Organiser mon équipe',
  communiquer: 'Communiquer avec les clients',
  recevoir_paiements: 'Recevoir les paiements',
  visible_internet: 'Être visible sur Internet',
  gagner_temps: 'Gagner du temps',
  outils_numeriques: 'Je ne sais pas utiliser les outils numériques',
  autre: 'Autre'
}

const needsLabels: Record<string, string> = {
  site_internet: 'Site internet',
  boutique_en_ligne: 'Boutique en ligne',
  application_mobile: 'Application mobile',
  gestion_clients: 'Gestion clients',
  gestion_stocks: 'Gestion stocks',
  facturation: 'Facturation',
  comptabilite: 'Comptabilité',
  reservation: 'Réservation',
  paiement_en_ligne: 'Paiement en ligne',
  marketing_digital: 'Marketing digital',
  gestion_reseaux_sociaux: 'Gestion réseaux sociaux',
  automatisation: 'Automatisation',
  ia: 'Intelligence artificielle',
  formation: 'Formation numérique'
}

const acquisitionLabels: Record<string, string> = {
  bouche_a_oreille: 'Bouche-à-oreille',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  google: 'Google',
  site_internet: 'Site internet',
  boutique_physique: 'Boutique physique',
  agents: 'Agents/Commerciaux',
  autre: 'Autre'
}

const willingToInvestLabels: Record<string, string> = {
  oui: 'Oui',
  peut_etre: 'Peut-être',
  besoin_info: 'Je souhaite d\'abord en savoir plus',
  non: 'Non'
}

const budgetLabels: Record<string, string> = {
  lt_25k: '< 25 000 FCFA',
  '25k_50k': '25 000 – 50 000 FCFA',
  '50k_100k': '50 000 – 100 000 FCFA',
  '100k_250k': '100 000 – 250 000 FCFA',
  '250k_500k': '250 000 – 500 000 FCFA',
  gt_500k: '+500 000 FCFA',
  unknown: 'Je ne sais pas'
}

const activityYearsLabels: Record<string, string> = {
  lt_1: 'Moins d\'1 an',
  '1_3': '1 à 3 ans',
  '3_5': '3 à 5 ans',
  '5_10': '5 à 10 ans',
  gt_10: 'Plus de 10 ans'
}

const activityLabels: Record<string, string> = {
  commerce: 'Commerce',
  agriculture: 'Agriculture',
  elevage: 'Élevage',
  restauration: 'Restauration',
  mode: 'Mode',
  beaute: 'Beauté',
  transport: 'Transport',
  immobilier: 'Immobilier',
  formation: 'Formation',
  services: 'Services',
  artisanat: 'Artisanat',
  sante: 'Santé',
  btp: 'BTP',
  technologie: 'Technologie',
  autre: 'Autre'
}

interface Stats {
  totalParticipants: number
  totalActivities: number
  totalCities: number
  interestedCount: number
  digitalMaturityAvg: number
  budgetAvg: number
}

interface ActivityData {
  name: string
  value: number
  count: number
}

interface ChallengeData {
  name: string
  value: number
}

interface DigitalNeedData {
  name: string
  value: number
}

interface BudgetData {
  name: string
  value: number
}

interface OpportunityScoreData {
  name: string
  score: number
  level: 'high' | 'medium' | 'low'
}

interface StatsResponse {
  participants: Array<{
    main_activity: string | null
    opportunity_score: number
    opportunity_level: string
    digital_maturity: number
    city: string | null
  }>
  totalParticipants: number
  challengesData: Array<{ challenge_name: string }>
  needsData: Array<{ need_name: string }>
  investmentData: Array<{ budget_range: string | null; willing_to_invest: string }>
  interestedLeads: Array<{
    name: string | null
    whatsapp: string | null
    email: string | null
    city: string | null
    main_activity: string | null
    opportunity_score: number
    opportunity_level: string
    contact?: {
      name: string | null
      whatsapp: string | null
      email: string | null
    }
  }>
  detailedResponses: Array<{
    id: string
    name: string | null
    city: string | null
    age_range: string | null
    main_activity: string | null
    activity_years: string | null
    whatsapp: string | null
    email: string | null
    contact_consent: boolean
    opportunity_score: number
    opportunity_level: string
    digital_maturity: number
    created_at: string
    contact?: {
      name: string | null
      whatsapp: string | null
      email: string | null
    }
    digital_tools: Array<{ tool_name: string }>
    challenges: Array<{ challenge_name: string }>
    digital_needs: Array<{ need_name: string }>
    acquisition_methods: Array<{ method_name: string }>
    investment_intention: Array<{ willing_to_invest: string | null; budget_range: string | null }>
  }>
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [challenges, setChallenges] = useState<ChallengeData[]>([])
  const [digitalNeeds, setDigitalNeeds] = useState<DigitalNeedData[]>([])
  const [budgets, setBudgets] = useState<BudgetData[]>([])
  const [opportunityScores, setOpportunityScores] = useState<OpportunityScoreData[]>([])
  const [interestedLeads, setInterestedLeads] = useState<StatsResponse['interestedLeads']>([])
  const [detailedResponses, setDetailedResponses] = useState<StatsResponse['detailedResponses']>([])
  const [selectedParticipant, setSelectedParticipant] = useState<StatsResponse['detailedResponses'][0] | null>(null)
  const [filters, setFilters] = useState({
    activity: 'all',
    city: 'all',
    budget: 'all',
    opportunityLevel: 'all'
  })
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        activity: filters.activity,
        opportunityLevel: filters.opportunityLevel,
      })
      const res = await fetch(`/api/admin/stats?${params}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Erreur de chargement')
      }
      const { participants, totalParticipants, challengesData, needsData, investmentData, interestedLeads, detailedResponses }: StatsResponse = await res.json()

      if (participants && participants.length > 0) {
        // Calculate stats
        const uniqueActivities = new Set(participants.map(p => p.main_activity).filter(Boolean)).size
        const uniqueCities = new Set(participants.map(p => p.city).filter(Boolean)).size
        const interestedCount = participants.filter(p => p.opportunity_score >= 40).length
        const digitalMaturityAvg = participants.reduce((sum, p) => sum + (p.digital_maturity || 0), 0) / participants.length
        
        // Calculate average budget from investment data
        let budgetAvg = 0
        if (investmentData && investmentData.length > 0) {
          const budgetMap: Record<string, number> = {
            '25000-50000': 37500,
            '50000-100000': 75000,
            '100000-250000': 175000,
            '250000-500000': 375000,
            '+500000': 500000
          }
          const budgets = investmentData
            .filter(i => i.budget_range && budgetMap[i.budget_range])
            .map(i => budgetMap[i.budget_range!])
          budgetAvg = budgets.length > 0 ? budgets.reduce((a, b) => a + b, 0) / budgets.length : 0
        }

        setStats({
          totalParticipants: totalParticipants || 0,
          totalActivities: uniqueActivities,
          totalCities: uniqueCities,
          interestedCount,
          digitalMaturityAvg: Math.round(digitalMaturityAvg * 10) / 10,
          budgetAvg: Math.round(budgetAvg)
        })

        // Aggregate activities
        const activityMap = new Map<string, number>()
        participants.forEach(p => {
          if (p.main_activity) {
            activityMap.set(p.main_activity, (activityMap.get(p.main_activity) || 0) + 1)
          }
        })
        setActivities(Array.from(activityMap.entries()).map(([name, count]) => ({ name, value: count, count })))

        // Aggregate opportunity scores by activity
        const activityScores = new Map<string, { totalScore: number, count: number }>()
        participants.forEach(p => {
          if (p.main_activity) {
            const current = activityScores.get(p.main_activity) || { totalScore: 0, count: 0 }
            activityScores.set(p.main_activity, {
              totalScore: current.totalScore + p.opportunity_score,
              count: current.count + 1
            })
          }
        })
        setOpportunityScores(
          Array.from(activityScores.entries())
            .map(([name, { totalScore, count }]) => {
              const avgScore = totalScore / count
              return {
                name,
                score: Math.round(avgScore),
                level: (avgScore >= 70 ? 'high' : avgScore >= 40 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
              }
            })
            .sort((a, b) => b.score - a.score)
        )
      }

      // Aggregate challenges
      if (challengesData) {
        const challengeMap = new Map<string, number>()
        challengesData.forEach(c => {
          challengeMap.set(c.challenge_name, (challengeMap.get(c.challenge_name) || 0) + 1)
        })
        setChallenges(Array.from(challengeMap.entries()).map(([name, value]) => ({ name, value })))
      }

      // Aggregate digital needs
      if (needsData) {
        const needMap = new Map<string, number>()
        needsData.forEach(n => {
          needMap.set(n.need_name, (needMap.get(n.need_name) || 0) + 1)
        })
        setDigitalNeeds(Array.from(needMap.entries()).map(([name, value]) => ({ name, value })))
      }

      // Aggregate budgets
      if (investmentData) {
        const budgetMap = new Map<string, number>()
        investmentData.forEach(i => {
          if (i.budget_range) {
            budgetMap.set(i.budget_range, (budgetMap.get(i.budget_range) || 0) + 1)
          }
        })
        setBudgets(Array.from(budgetMap.entries()).map(([name, value]) => ({ name, value })))
      }

      if (interestedLeads) {
        setInterestedLeads(interestedLeads)
      }

      if (detailedResponses) {
        setDetailedResponses(detailedResponses)
      }

    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const exportData = (format: 'csv' | 'excel' | 'json') => {
    const data = { stats, activities, challenges, digitalNeeds, budgets, opportunityScores }
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'digital-needs-export.json'
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'csv') {
      // Simple CSV export for stats
      const csvContent = 'data:text/csv;charset=utf-8,' + 
        'Metric,Value\n' +
        `Total Participants,${stats?.totalParticipants || 0}\n` +
        `Total Activities,${stats?.totalActivities || 0}\n` +
        `Total Cities,${stats?.totalCities || 0}\n` +
        `Interested Count,${stats?.interestedCount || 0}\n` +
        `Digital Maturity Avg,${stats?.digitalMaturityAvg || 0}\n` +
        `Budget Avg,${stats?.budgetAvg || 0}`
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'digital-needs-export.csv'
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'excel') {
      // For Excel, we'll export as CSV with .xls extension (simple approach)
      const csvContent = 'data:text/csv;charset=utf-8,' + 
        'Metric,Value\n' +
        `Total Participants,${stats?.totalParticipants || 0}\n` +
        `Total Activities,${stats?.totalActivities || 0}\n` +
        `Total Cities,${stats?.totalCities || 0}\n` +
        `Interested Count,${stats?.interestedCount || 0}\n` +
        `Digital Maturity Avg,${stats?.digitalMaturityAvg || 0}\n` +
        `Budget Avg,${stats?.budgetAvg || 0}`
      const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'digital-needs-export.xls'
      a.click()
      URL.revokeObjectURL(url)
    }
  }
  
  const getOpportunityBadge = (level: string) => {
    const colors = {
      high: 'bg-electric-green/10 text-electric-green border-electric-green/30',
      medium: 'bg-amber-100 text-amber-700 border-amber-300',
      low: 'bg-graphite/10 text-graphite border-graphite/30'
    }
    const labels = {
      high: '🔥 Forte',
      medium: '🟡 Moyenne',
      low: '⚪ Faible'
    }
    return (
      <span className={`px-4 py-2 rounded-full text-xs font-medium border ${colors[level as keyof typeof colors]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    )
  }
  
  return (
    <div className="min-h-screen bg-off-white relative overflow-hidden">
      <Navigation />
      
      <div className="relative z-10 p-8 md:p-16 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-electric-green/10 border border-electric-green/20">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-electric-green">Market Intelligence</span>
            </div>
            <button
              onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); window.location.href = '/admin/login' }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/10 text-deep-black text-sm hover:bg-black/5 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-deep-black mb-4 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xl text-graphite max-w-2xl">
            Analyse des opportunités de marché pour la digitalisation
          </p>
        </motion.div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-black/10" />
                <div className="absolute inset-0 rounded-full border-2 border-electric-green border-t-transparent animate-spin" />
              </div>
              <p className="text-graphite text-lg">Chargement des données...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-900 text-lg">Erreur de chargement</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        {!loading && !error && stats && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-electric-green/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-electric-green" />
                </div>
                <span className="text-xs uppercase tracking-[0.15em] text-graphite">Participants</span>
              </div>
              <div className="text-4xl font-bold text-deep-black mb-2 tracking-tight">
                {stats.totalParticipants.toLocaleString()}
              </div>
              <div className="text-sm text-graphite">
                {stats.interestedCount} intéressés
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-deep-blue/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-deep-blue" />
                </div>
                <span className="text-xs uppercase tracking-[0.15em] text-graphite">Activités</span>
              </div>
              <div className="text-4xl font-bold text-deep-black mb-2 tracking-tight">
                {stats.totalActivities}
              </div>
              <div className="text-sm text-graphite">
                {stats.totalCities} villes couvertes
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-electric-green/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-electric-green" />
                </div>
                <span className="text-xs uppercase tracking-[0.15em] text-graphite">Score moyen</span>
              </div>
              <div className="text-4xl font-bold text-deep-black mb-2 tracking-tight">
                {stats.digitalMaturityAvg}/10
              </div>
              <div className="text-sm text-graphite">
                Maturité digitale
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-deep-blue/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-deep-blue" />
                </div>
                <span className="text-xs uppercase tracking-[0.15em] text-graphite">Budget moyen</span>
              </div>
              <div className="text-4xl font-bold text-deep-black mb-2 tracking-tight">
                {new Intl.NumberFormat('fr-FR').format(stats.budgetAvg)} F
              </div>
              <div className="text-sm text-graphite">
                Par participant intéressé
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Filters and Export */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-16 items-center justify-between"
        >
          <div className="flex gap-4">
            <select
              value={filters.activity}
              onChange={(e) => setFilters({ ...filters, activity: e.target.value })}
              className="px-6 py-3 rounded-full bg-white border border-black/10 text-deep-black text-sm focus:outline-none focus:border-electric-green transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              <option value="all">Toutes les activités</option>
              {activities.map(activity => (
                <option key={activity.name} value={activity.name}>{activity.name}</option>
              ))}
            </select>
            
            <select
              value={filters.opportunityLevel}
              onChange={(e) => setFilters({ ...filters, opportunityLevel: e.target.value })}
              className="px-6 py-3 rounded-full bg-white border border-black/10 text-deep-black text-sm focus:outline-none focus:border-electric-green transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              <option value="all">Tous les niveaux</option>
              <option value="high">Opportunité forte</option>
              <option value="medium">Opportunité moyenne</option>
              <option value="low">Opportunité faible</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => exportData('csv')}
              className="group px-6 py-3 rounded-full bg-white border border-black/10 text-deep-black text-sm font-medium hover:bg-black/5 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => exportData('excel')}
              className="group px-6 py-3 rounded-full bg-white border border-black/10 text-deep-black text-sm font-medium hover:bg-black/5 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3"
            >
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => exportData('json')}
              className="group px-6 py-3 rounded-full bg-white border border-black/10 text-deep-black text-sm font-medium hover:bg-black/5 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>
          </div>
        </motion.div>
        
        {/* Charts */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm h-full">
                <h3 className="text-xl font-semibold text-deep-black mb-6 tracking-tight">Activités les plus représentées</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activities}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} stroke="rgba(0,0,0,0.4)" />
                    <YAxis fontSize={12} stroke="rgba(0,0,0,0.4)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid rgba(0,0,0,0.1)', 
                        borderRadius: '12px',
                        color: '#0A0A0A'
                      }} 
                    />
                    <Bar dataKey="count" fill="#18C77A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.4 }}
            >
              <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm h-full">
                <h3 className="text-xl font-semibold text-deep-black mb-6 tracking-tight">Problèmes les plus fréquents</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={challenges}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {challenges.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid rgba(0,0,0,0.1)', 
                        borderRadius: '12px',
                        color: '#0A0A0A'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.5 }}
            >
              <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm h-full">
                <h3 className="text-xl font-semibold text-deep-black mb-6 tracking-tight">Solutions numériques demandées</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={digitalNeeds} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis type="number" fontSize={12} stroke="rgba(0,0,0,0.4)" />
                    <YAxis dataKey="name" type="category" width={100} fontSize={12} stroke="rgba(0,0,0,0.4)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid rgba(0,0,0,0.1)', 
                        borderRadius: '12px',
                        color: '#0A0A0A'
                      }} 
                    />
                    <Bar dataKey="value" fill="#3157FF" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.6 }}
            >
              <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm h-full">
                <h3 className="text-xl font-semibold text-deep-black mb-6 tracking-tight">Répartition des budgets</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgets}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" fontSize={12} stroke="rgba(0,0,0,0.4)" />
                    <YAxis fontSize={12} stroke="rgba(0,0,0,0.4)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid rgba(0,0,0,0.1)', 
                        borderRadius: '12px',
                        color: '#0A0A0A'
                      }} 
                    />
                    <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Opportunity Scores Table */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.7 }}
          >
            <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm">
              <h3 className="text-xl font-semibold text-deep-black mb-6 tracking-tight">Scores d'opportunité par secteur</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/10">
                      <th className="text-left py-4 px-6 text-sm font-medium text-graphite uppercase tracking-[0.1em]">Secteur</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-graphite uppercase tracking-[0.1em]">Score</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-graphite uppercase tracking-[0.1em]">Niveau</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-graphite uppercase tracking-[0.1em]">Recommandation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunityScores.map((item, index) => (
                      <tr key={index} className="border-b border-black/5 hover:bg-black/5 transition-colors duration-300">
                        <td className="py-4 px-6 font-medium text-deep-black">{item.name}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-black/10 rounded-full h-2">
                              <div
                                className="bg-electric-green h-2 rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-deep-black">{item.score}/100</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {getOpportunityBadge(item.level)}
                        </td>
                        <td className="py-4 px-6 text-sm text-graphite">
                          {item.level === 'high' && 'Priorité haute - lancer solution'}
                          {item.level === 'medium' && 'Étudier le marché'}
                          {item.level === 'low' && 'Surveiller l\'évolution'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Interested Leads Table */}
        {!loading && !error && interestedLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.8 }}
            className="mt-16"
          >
            <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm">
              <h3 className="text-xl font-semibold text-deep-black mb-6 tracking-tight">Participants intéressés</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/10">
                      <th className="text-left py-4 px-6 text-sm font-medium text-graphite uppercase tracking-[0.1em]">Nom</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-graphite uppercase tracking-[0.1em]">Ville</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-graphite uppercase tracking-[0.1em]">Activité</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-graphite uppercase tracking-[0.1em]">WhatsApp</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-graphite uppercase tracking-[0.1em]">Email</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-graphite uppercase tracking-[0.1em]">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interestedLeads.map((lead, index) => (
                      <tr key={index} className="border-b border-black/5 hover:bg-black/5 transition-colors duration-300">
                        <td className="py-4 px-6 font-medium text-deep-black">{lead.contact?.name || lead.name || '-'}</td>
                        <td className="py-4 px-6 text-sm text-graphite">{lead.city || '-'}</td>
                        <td className="py-4 px-6 text-sm text-graphite">{lead.main_activity || '-'}</td>
                        <td className="py-4 px-6 text-sm text-graphite">{lead.contact?.whatsapp || lead.whatsapp || '-'}</td>
                        <td className="py-4 px-6 text-sm text-graphite">{lead.contact?.email || lead.email || '-'}</td>
                        <td className="py-4 px-6">
                          {getOpportunityBadge(lead.opportunity_level)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Responses Table */}
        {!loading && !error && detailedResponses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 1 }}
            className="mt-16"
          >
            <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm">
              <h3 className="text-xl font-semibold text-deep-black mb-6 tracking-tight">Réponses détaillées des participants</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/10">
                      <th className="text-left py-4 px-4 text-xs font-medium text-graphite uppercase tracking-[0.1em]">Nom</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-graphite uppercase tracking-[0.1em]">Contact</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-graphite uppercase tracking-[0.1em]">Ville</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-graphite uppercase tracking-[0.1em]">Activité</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-graphite uppercase tracking-[0.1em]">Outils numériques</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-graphite uppercase tracking-[0.1em]">Défis</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-graphite uppercase tracking-[0.1em]">Besoins</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-graphite uppercase tracking-[0.1em]">Budget</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-graphite uppercase tracking-[0.1em]">Intérêt</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-graphite uppercase tracking-[0.1em]">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedResponses.map((response, index) => (
                      <tr 
                        key={response.id} 
                        className="border-b border-black/5 hover:bg-black/5 transition-colors duration-300 cursor-pointer"
                        onClick={() => setSelectedParticipant(response)}
                      >
                        <td className="py-4 px-4 font-medium text-deep-black">{response.contact?.name || response.name || '-'}</td>
                        <td className="py-4 px-4 text-xs text-graphite">
                          {(response.contact?.whatsapp || response.whatsapp) && <div>📱 {response.contact?.whatsapp || response.whatsapp}</div>}
                          {(response.contact?.email || response.email) && <div>✉️ {response.contact?.email || response.email}</div>}
                          {!response.contact?.whatsapp && !response.whatsapp && !response.contact?.email && !response.email && '-'}
                        </td>
                        <td className="py-4 px-4 text-xs text-graphite">{response.city || '-'}</td>
                        <td className="py-4 px-4 text-xs text-graphite">{activityLabels[response.main_activity || ''] || response.main_activity || '-'}</td>
                        <td className="py-4 px-4 text-xs text-graphite max-w-xs truncate">
                          {response.digital_tools.map(t => digitalToolsLabels[t.tool_name || ''] || t.tool_name).join(', ') || '-'}
                        </td>
                        <td className="py-4 px-4 text-xs text-graphite max-w-xs truncate">
                          {response.challenges.map(c => challengesLabels[c.challenge_name || ''] || c.challenge_name).join(', ') || '-'}
                        </td>
                        <td className="py-4 px-4 text-xs text-graphite max-w-xs truncate">
                          {response.digital_needs.map(n => needsLabels[n.need_name || ''] || n.need_name).join(', ') || '-'}
                        </td>
                        <td className="py-4 px-4 text-xs text-graphite">
                          {response.investment_intention[0]?.budget_range || '-'}
                        </td>
                        <td className="py-4 px-4">
                          {response.contact_consent ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-electric-green/10 text-electric-green text-xs font-medium">
                              Oui
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                              Non
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {getOpportunityBadge(response.opportunity_level)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Participant Details Modal */}
        <AnimatePresence>
          {selectedParticipant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-3xl flex items-center justify-center p-6"
              onClick={() => setSelectedParticipant(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-black/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-deep-black">Détails du participant</h3>
                  <button
                    onClick={() => setSelectedParticipant(null)}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-deep-black" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Nom</label>
                      <p className="text-deep-black font-medium">{selectedParticipant.contact?.name || selectedParticipant.name || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Ville</label>
                      <p className="text-deep-black font-medium">{selectedParticipant.city || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Tranche d'âge</label>
                      <p className="text-deep-black font-medium">{selectedParticipant.age_range || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Ancienneté</label>
                      <p className="text-deep-black font-medium">{activityYearsLabels[selectedParticipant.activity_years || ''] || selectedParticipant.activity_years || '-'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">WhatsApp</label>
                      <p className="text-deep-black font-medium">{selectedParticipant.contact?.whatsapp || selectedParticipant.whatsapp || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Email</label>
                      <p className="text-deep-black font-medium">{selectedParticipant.contact?.email || selectedParticipant.email || '-'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Activité principale</label>
                    <p className="text-deep-black font-medium">{activityLabels[selectedParticipant.main_activity || ''] || selectedParticipant.main_activity || '-'}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Outils numériques</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipant.digital_tools.length > 0 ? (
                        selectedParticipant.digital_tools.map((tool, idx) => (
                          <span key={idx} className="px-3 py-1 bg-electric-green/10 text-electric-green rounded-full text-sm">
                            {digitalToolsLabels[tool.tool_name || ''] || tool.tool_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-graphite">-</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Défis</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipant.challenges.length > 0 ? (
                        selectedParticipant.challenges.map((challenge, idx) => (
                          <span key={idx} className="px-3 py-1 bg-deep-blue/10 text-deep-blue rounded-full text-sm">
                            {challengesLabels[challenge.challenge_name || ''] || challenge.challenge_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-graphite">-</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Besoins numériques</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipant.digital_needs.length > 0 ? (
                        selectedParticipant.digital_needs.map((need, idx) => (
                          <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            {needsLabels[need.need_name || ''] || need.need_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-graphite">-</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Prêt à investir</label>
                      <p className="text-deep-black font-medium">
                        {willingToInvestLabels[selectedParticipant.investment_intention[0]?.willing_to_invest || ''] || selectedParticipant.investment_intention[0]?.willing_to_invest || '-'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Budget</label>
                      <p className="text-deep-black font-medium">
                        {budgetLabels[selectedParticipant.investment_intention[0]?.budget_range || ''] || selectedParticipant.investment_intention[0]?.budget_range || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-black/10">
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Score opportunité</label>
                      <p className="text-deep-black font-bold text-2xl">{selectedParticipant.opportunity_score}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Niveau</label>
                      <div className="mt-1">{getOpportunityBadge(selectedParticipant.opportunity_level)}</div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Maturité digitale</label>
                      <p className="text-deep-black font-medium">{selectedParticipant.digital_maturity}/10</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-graphite uppercase tracking-[0.1em] block mb-2">Date de création</label>
                    <p className="text-deep-black font-medium text-sm">
                      {new Date(selectedParticipant.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}