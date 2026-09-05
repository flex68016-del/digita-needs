import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-off-white">
      <Navigation />
      
      <div className="pt-32 pb-16 px-6 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-deep-black mb-8 tracking-tight">
          Conditions d'utilisation
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-graphite mb-6">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">1. Acceptation des conditions</h2>
          <p className="text-graphite mb-6">
            En accédant à ce site et en participant à notre étude, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
          </p>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">2. Utilisation du site</h2>
          <p className="text-graphite mb-4">
            Ce site est destiné à :
          </p>
          <ul className="list-disc pl-6 text-graphite mb-6">
            <li>Permettre aux professionnels de participer à notre étude sur la digitalisation</li>
            <li>Fournir des informations sur nos services</li>
            <li>Faciliter la collecte de données pour la recherche</li>
          </ul>
          <p className="text-graphite mb-6">
            Vous vous engagez à utiliser ce site de manière légale et à ne pas tenter d'accéder au site par des moyens non autorisés.
          </p>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">3. Propriété intellectuelle</h2>
          <p className="text-graphite mb-6">
            Tout le contenu de ce site (textes, images, logos, design) est la propriété de Digital Needs ou de ses partenaires et est protégé par les lois sur la propriété intellectuelle. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.
          </p>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">4. Données personnelles</h2>
          <p className="text-graphite mb-6">
            La collecte et l'utilisation de vos données personnelles sont régies par notre politique de confidentialité. En utilisant ce site, vous consentez à la collecte et au traitement de vos données comme décrit dans cette politique.
          </p>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">5. Limitation de responsabilité</h2>
          <p className="text-graphite mb-6">
            Digital Needs ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou de l'impossibilité d'utiliser ce site.
          </p>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">6. Modifications des conditions</h2>
          <p className="text-graphite mb-6">
            Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les modifications prendront effet dès leur publication sur le site.
          </p>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">7. Contact</h2>
          <p className="text-graphite mb-6">
            Pour toute question concernant ces conditions d'utilisation, contactez-nous à : contact@digitalneeds.com
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
