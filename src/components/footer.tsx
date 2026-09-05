import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/10 py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-graphite">
            © {new Date().getFullYear()} Digital Needs. Tous droits réservés.
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/privacy" 
              className="text-sm text-graphite hover:text-deep-black transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-graphite hover:text-deep-black transition-colors"
            >
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
