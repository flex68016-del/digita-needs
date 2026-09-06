import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-off-white">
      <Navigation />
      
      <div className="pt-32 pb-16 px-6 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-deep-black mb-8 tracking-tight">
          Politique de confidentialité
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-graphite mb-6">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">1. Collecte des données</h2>
          <p className="text-graphite mb-4">
            Nous collectons les informations que vous nous fournissez volontairement lors de votre participation à notre étude sur la digitalisation. Ces informations incluent :
          </p>
          <ul className="list-disc pl-6 text-graphite mb-6">
            <li>Votre nom (optionnel)</li>
            <li>Votre numéro WhatsApp (optionnel)</li>
            <li>Votre adresse email (optionnel)</li>
            <li>Votre activité professionnelle</li>
            <li>Votre secteur d'activité</li>
            <li>Votre localisation géographique</li>
            <li>Vos défis et besoins en matière de digitalisation</li>
            <li>Vos intentions d'investissement dans des solutions numériques</li>
          </ul>
          <p className="text-graphite mb-6">
            Les données de contact (nom, WhatsApp, email) sont collectées uniquement si vous consentez à être informé des solutions correspondant à vos besoins.
          </p>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">2. Utilisation des données</h2>
          <p className="text-graphite mb-4">
            Les données collectées sont utilisées exclusivement à des fins de recherche et d'analyse pour :
          </p>
          <ul className="list-disc pl-6 text-graphite mb-6">
            <li>Comprendre les besoins de digitalisation des professionnels</li>
            <li>Identifier les opportunités de marché</li>
            <li>Améliorer nos services et solutions</li>
            <li>Générer des statistiques agrégées et anonymisées</li>
            <li>Vous informer des solutions numériques correspondant à vos besoins (uniquement si vous avez consenti)</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">3. Protection des données</h2>
          <p className="text-graphite mb-6">
            Nous prenons toutes les mesures nécessaires pour protéger vos données personnelles. Vos réponses sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers sans votre consentement explicite.
          </p>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">4. Vos droits</h2>
          <p className="text-graphite mb-4">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 text-graphite mb-6">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-deep-black mt-8 mb-4">5. Contact</h2>
          <p className="text-graphite mb-6">
            Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits, contactez-nous à : contact@digitalneeds.com
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
