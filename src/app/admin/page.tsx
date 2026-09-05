"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { motion } from 'motion/react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import { Download, Filter, TrendingUp, Users, Building, MapPin, Target, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const COLORS = ['#18C77A', '#3157FF', '#F59E0B', '#EF4444', '#8B5CF6']

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

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [challenges, setChallenges] = useState<ChallengeData[]>([])
  const [digitalNeeds, setDigitalNeeds] = useState<DigitalNeedData[]>([])
  const [budgets, setBudgets] = useState<BudgetData[]>([])
  const [opportunityScores, setOpportunityScores] = useState<OpportunityScoreData[]>([])
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

      // Build query with filters
      let query = supabase
        .from('participants')
        .select('main_activity, opportunity_score, opportunity_level, digital_maturity, city')

      // Apply activity filter
      if (filters.activity !== 'all') {
        query = query.eq('main_activity', filters.activity)
      }

      // Apply opportunity level filter
      if (filters.opportunityLevel !== 'all') {
        query = query.eq('opportunity_level', filters.opportunityLevel)
      }

      // Fetch filtered participants
      const { data: participants } = await query

      // Fetch total participants (without filters for stats)
      const { count: totalParticipants } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })

      // Fetch challenges count
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('challenge_name')

      // Fetch digital needs count
      const { data: needsData } = await supabase
        .from('digital_needs')
        .select('need_name')

      // Fetch investment intentions
      const { data: investmentData } = await supabase
        .from('investment_intention')
        .select('budget_range, willing_to_invest')

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
            .map(i => budgetMap[i.budget_range])
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
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-white/10 text-white/60 border-white/20'
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
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Radial gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[100px]" />
      </div>
      
      <Navigation />
      
      <div className="relative z-10 p-8 md:p-16 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/60">Market Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xl text-white/40 max-w-2xl">
            Analyse des opportunités de marché pour la digitalisation
          </p>
        </motion.div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              </div>
              <p className="text-white/60 text-lg">Chargement des données...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 mb-12 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="font-medium text-red-400 text-lg">Erreur de chargement</p>
                <p className="text-sm text-red-400/60">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards - Asymmetrical Bento Grid */}
        {!loading && !error && stats && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {/* Double-Bezel Card 1 */}
            <div className="bg-white/5 rounded-[2rem] p-1.5 border border-white/10">
              <div className="bg-black/40 rounded-[calc(2rem-0.375rem)] p-6 h-full backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">Participants</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                  {stats.totalParticipants.toLocaleString()}
                </div>
                <div className="text-sm text-white/40">
                  {stats.interestedCount} intéressés
                </div>
              </div>
            </div>
            
            {/* Double-Bezel Card 2 */}
            <div className="bg-white/5 rounded-[2rem] p-1.5 border border-white/10">
              <div className="bg-black/40 rounded-[calc(2rem-0.375rem)] p-6 h-full backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">Activités</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                  {stats.totalActivities}
                </div>
                <div className="text-sm text-white/40">
                  {stats.totalCities} villes couvertes
                </div>
              </div>
            </div>
            
            {/* Double-Bezel Card 3 */}
            <div className="bg-white/5 rounded-[2rem] p-1.5 border border-white/10">
              <div className="bg-black/40 rounded-[calc(2rem-0.375rem)] p-6 h-full backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">Score moyen</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                  {stats.digitalMaturityAvg}/10
                </div>
                <div className="text-sm text-white/40">
                  Maturité digitale
                </div>
              </div>
            </div>
            
            {/* Double-Bezel Card 4 */}
            <div className="bg-white/5 rounded-[2rem] p-1.5 border border-white/10">
              <div className="bg-black/40 rounded-[calc(2rem-0.375rem)] p-6 h-full backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">Budget moyen</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                  {new Intl.NumberFormat('fr-FR').format(stats.budgetAvg)} F
                </div>
                <div className="text-sm text-white/40">
                  Par participant intéressé
                </div>
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
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400/50 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              <option value="all" className="bg-[#0a0a0a]">Toutes les activités</option>
              {activities.map(activity => (
                <option key={activity.name} value={activity.name} className="bg-[#0a0a0a]">{activity.name}</option>
              ))}
            </select>
            
            <select
              value={filters.opportunityLevel}
              onChange={(e) => setFilters({ ...filters, opportunityLevel: e.target.value })}
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400/50 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              <option value="all" className="bg-[#0a0a0a]">Tous les niveaux</option>
              <option value="high" className="bg-[#0a0a0a]">Opportunité forte</option>
              <option value="medium" className="bg-[#0a0a0a]">Opportunité moyenne</option>
              <option value="low" className="bg-[#0a0a0a]">Opportunité faible</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => exportData('csv')}
              className="group px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => exportData('excel')}
              className="group px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3"
            >
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => exportData('json')}
              className="group px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>
          </div>
        </motion.div>
        
        {/* Charts - Double-Bezel Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
            >
              <div className="bg-white/5 rounded-[2rem] p-1.5 border border-white/10 h-full">
                <div className="bg-black/40 rounded-[calc(2rem-0.375rem)] p-8 h-full backdrop-blur-2xl">
                  <h3 className="text-xl font-semibold text-white mb-6 tracking-tight">Activités les plus représentées</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activities}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} stroke="rgba(255,255,255,0.4)" />
                      <YAxis fontSize={12} stroke="rgba(255,255,255,0.4)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          color: 'white'
                        }} 
                      />
                      <Bar dataKey="count" fill="#18C77A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.4 }}
            >
              <div className="bg-white/5 rounded-[2rem] p-1.5 border border-white/10 h-full">
                <div className="bg-black/40 rounded-[calc(2rem-0.375rem)] p-8 h-full backdrop-blur-2xl">
                  <h3 className="text-xl font-semibold text-white mb-6 tracking-tight">Problèmes les plus fréquents</h3>
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
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          color: 'white'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.5 }}
            >
              <div className="bg-white/5 rounded-[2rem] p-1.5 border border-white/10 h-full">
                <div className="bg-black/40 rounded-[calc(2rem-0.375rem)] p-8 h-full backdrop-blur-2xl">
                  <h3 className="text-xl font-semibold text-white mb-6 tracking-tight">Solutions numériques demandées</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={digitalNeeds} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" fontSize={12} stroke="rgba(255,255,255,0.4)" />
                      <YAxis dataKey="name" type="category" width={100} fontSize={12} stroke="rgba(255,255,255,0.4)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          color: 'white'
                        }} 
                      />
                      <Bar dataKey="value" fill="#3157FF" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.6 }}
            >
              <div className="bg-white/5 rounded-[2rem] p-1.5 border border-white/10 h-full">
                <div className="bg-black/40 rounded-[calc(2rem-0.375rem)] p-8 h-full backdrop-blur-2xl">
                  <h3 className="text-xl font-semibold text-white mb-6 tracking-tight">Répartition des budgets</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgets}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" fontSize={12} stroke="rgba(255,255,255,0.4)" />
                      <YAxis fontSize={12} stroke="rgba(255,255,255,0.4)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          color: 'white'
                        }} 
                      />
                      <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Opportunity Scores Table - Double-Bezel */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.7 }}
          >
            <div className="bg-white/5 rounded-[2rem] p-1.5 border border-white/10">
              <div className="bg-black/40 rounded-[calc(2rem-0.375rem)] p-8 backdrop-blur-2xl">
                <h3 className="text-xl font-semibold text-white mb-6 tracking-tight">Scores d'opportunité par secteur</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-6 text-sm font-medium text-white/40 uppercase tracking-[0.1em]">Secteur</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-white/40 uppercase tracking-[0.1em]">Score</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-white/40 uppercase tracking-[0.1em]">Niveau</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-white/40 uppercase tracking-[0.1em]">Recommandation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {opportunityScores.map((item, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-300">
                          <td className="py-4 px-6 font-medium text-white">{item.name}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-white/10 rounded-full h-2">
                                <div
                                  className="bg-emerald-400 h-2 rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                                  style={{ width: `${item.score}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-white">{item.score}/100</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {getOpportunityBadge(item.level)}
                          </td>
                          <td className="py-4 px-6 text-sm text-white/60">
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
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}