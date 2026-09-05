"use client"

import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { ArrowRight, Target, Users, TrendingUp, Shield, Clock, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-off-white">
      <Navigation />
      
      {/* Hero */}
      <section className="min-h-[60vh] flex items-center justify-center p-6 md:p-12 bg-gradient-to-b from-white to-off-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-deep-black mb-6">
            À propos de l'étude
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprendre les besoins numériques des professionnels pour construire les solutions de demain
          </p>
        </motion.div>
      </section>
      
      {/* Why this study */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-deep-black mb-4">
              Pourquoi cette étude ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              La transformation numérique touche tous les secteurs économiques, mais chaque activité a des besoins spécifiques. 
              Cette étude vise à identifier précisément ces besoins pour développer des solutions adaptées et efficaces.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-8 h-8 text-electric-green" />,
                title: "Identifier les besoins",
                description: "Comprendre les défis réels des professionnels et entrepreneurs dans leur quotidien"
              },
              {
                icon: <Users className="w-8 h-8 text-deep-blue" />,
                title: "Inclure tous les secteurs",
                description: "Ne laisser personne de côté dans la transition numérique, du commerce à l'agriculture"
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-electric-green" />,
                title: "Créer des opportunités",
                description: "Transformer les problèmes en solutions innovantes et créatrices de valeur"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-deep-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Who can participate */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-deep-black mb-4">
              Qui peut participer ?
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Commerçants",
              "Artisans",
              "Agriculteurs",
              "Transporteurs",
              "Restaurateurs",
              "Professions libérales",
              "Associations",
              "Particuliers"
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 text-center hover:border-electric-green transition-colors">
                  <span className="font-medium text-deep-black">{item}</span>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How data is used */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-deep-black mb-4">
              Comment les données sont utilisées ?
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6 text-electric-green" />,
                title: "Confidentialité garantie",
                description: "Vos réponses sont anonymisées et utilisées uniquement à des fins d'analyse statistique"
              },
              {
                icon: <Globe className="w-6 h-6 text-deep-blue" />,
                title: "Analyse agrégée",
                description: "Seules des données agrégées sont partagées, jamais de données individuelles identifiables"
              },
              {
                icon: <Clock className="w-6 h-6 text-electric-green" />,
                title: "Temps limité",
                description: "L'étude se concentre sur une période définie pour garantir la pertinence des données"
              },
              {
                icon: <Users className="w-6 h-6 text-deep-blue" />,
                title: "Bénéfice collectif",
                description: "Les résultats serviront à développer des solutions qui bénéficient à tous les participants"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 flex gap-4">
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-deep-black mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why digitalization matters */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-deep-black mb-4">
              Pourquoi la digitalisation est importante ?
            </h2>
            <p className="text-lg text-gray-600">
              La digitalisation n'est pas une option, c'est une nécessité pour rester compétitif dans un monde en constante évolution. 
              Elle permet de gagner du temps, d'atteindre plus de clients, et de prendre des décisions basées sur des données réelles.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => window.location.href = '/'}
            >
              Participer à l'étude
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-off-white to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-deep-black mb-4">
              Prêt à participer ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              En seulement 5 minutes, contribuez à mieux comprendre les besoins numériques des professionnels
            </p>
            <Button
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => window.location.href = '/'}
            >
              Commencer l'étude
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  )
}