"use client"
import { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

interface ProfileData {
  name: string
  city: string
  ageRange: string
  activityYears: string
}

export function ProfileIntro({ onComplete }: { onComplete: (data: ProfileData) => void }) {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [activityYears, setActivityYears] = useState('')
  const canContinue = city.trim().length > 0 && ageRange && activityYears

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-deep-black focus:outline-none focus:ring-2 focus:ring-electric-green"

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-xl mx-auto">
      <div className="text-sm font-medium text-electric-green mb-4 uppercase tracking-[0.15em]">Avant de commencer</div>
      <h2 className="text-4xl md:text-5xl font-bold text-deep-black mb-4 leading-tight tracking-tight">Parlez-nous de vous</h2>
      <p className="text-lg text-graphite max-w-2xl mb-8">Quelques informations rapides pour mieux comprendre qui répond à cette étude.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-graphite mb-2">Nom (facultatif)</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Votre nom" />
        </div>
        <div>
          <label className="block text-sm font-medium text-graphite mb-2">Ville</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Lomé, Kara, Sokodé..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-graphite mb-2">Tranche d'âge</label>
          <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className={inputClass}>
            <option value="">Sélectionner</option>
            <option value="18-25">18-25 ans</option>
            <option value="26-35">26-35 ans</option>
            <option value="36-45">36-45 ans</option>
            <option value="46-55">46-55 ans</option>
            <option value="56+">56 ans et plus</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-graphite mb-2">Ancienneté de votre activité</label>
          <select value={activityYears} onChange={(e) => setActivityYears(e.target.value)} className={inputClass}>
            <option value="">Sélectionner</option>
            <option value="lt_1">Moins d'1 an</option>
            <option value="1_3">1 à 3 ans</option>
            <option value="3_5">3 à 5 ans</option>
            <option value="5_10">5 à 10 ans</option>
            <option value="gt_10">Plus de 10 ans</option>
          </select>
        </div>
      </div>

      <Button className="mt-8" disabled={!canContinue} onClick={() => onComplete({ name, city, ageRange, activityYears })}>
        Continuer
      </Button>
    </motion.div>
  )
}
