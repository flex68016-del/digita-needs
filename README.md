# Digital Needs Survey

Une application web pour collecter et analyser les besoins numériques des professionnels et entrepreneurs, avec un dashboard administratif sécurisé.

## Fonctionnalités

- **Sondage interactif** : Formulaire en 6 étapes pour comprendre les activités, défis et besoins numériques
- **Dashboard admin** : Analyse des données avec visualisations (graphiques, KPIs)
- **Authentification sécurisée** : Cookie-based session avec rate limiting et validation des inputs
- **Base de données** : Supabase avec Row Level Security (RLS)
- **Export de données** : CSV, Excel, JSON

## Stack Technique

- **Frontend** : Next.js 16 (App Router), React, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **Animations** : Framer Motion
- **Charts** : Recharts
- **Base de données** : Supabase
- **Validation** : Zod
- **Sécurité** : Rate limiting, security headers, HTTPS enforcement

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/flex68016-del/digita-needs.git
cd digital-needs-survey
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement dans `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
ADMIN_PASSWORD=votre_mot_de_passe_admin
```

4. Lancer le serveur de développement :
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000)

## Déploiement

### Vercel

1. Connecter le repository à Vercel
2. Ajouter les variables d'environnement dans les settings du projet
3. Déployer

### Variables d'environnement requises

- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anon publique Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service role Supabase (pour l'admin)
- `ADMIN_PASSWORD` : Mot de passe pour accéder au dashboard admin

## Structure du projet

```
src/
├── app/
│   ├── admin/           # Dashboard admin
│   ├── api/admin/       # API routes admin (login, logout, stats)
│   └── page.tsx         # Page d'accueil avec sondage
├── components/          # Composants UI réutilisables
├── lib/
│   ├── auth.ts          # Fonctions d'authentification
│   ├── rate-limit.ts    # Rate limiting
│   └── supabase.ts      # Client Supabase
└── middleware.ts        # Middleware Next.js (auth, HTTPS)
```

## Sécurité

- Rate limiting sur le login (5 tentatives / 15 minutes)
- Validation des inputs avec Zod
- Cookies httpOnly, secure, sameSite=strict
- Security headers (HSTS, X-Frame-Options, etc.)
- HTTPS forcé en production
- Supabase RLS activé

## License

MIT
