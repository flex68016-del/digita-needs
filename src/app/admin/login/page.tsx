"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Erreur de connexion')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-off-white flex items-center justify-center p-6">
      <Card variant="elevated" className="w-full max-w-sm p-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-deep-black/5 mb-6 mx-auto">
          <Lock className="w-5 h-5 text-deep-black" />
        </div>
        <h1 className="text-2xl font-bold text-deep-black text-center mb-2">Espace admin</h1>
        <p className="text-graphite text-center text-sm mb-8">Accès réservé</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-deep-black placeholder:text-graphite/60 focus:outline-none focus:ring-2 focus:ring-electric-green"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>
            Se connecter
          </Button>
        </form>
      </Card>
    </main>
  )
}
