# Mariage Johan & Camille — RSVP

App RSVP pour le mariage de Johan & Camille.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (PostgreSQL, RLS)
- **Tailwind CSS v4**
- **Vercel** (déploiement)

## Setup

### 1. Installer les dépendances

```bash
cd mariage-johan-camille
npm install
```

### 2. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com) → New project
2. Dans le SQL Editor, exécuter le contenu de `supabase/migration.sql`
3. Récupérer l'URL et la clé anon dans Settings → API

### 3. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplir les valeurs dans `.env.local` :
- `NEXT_PUBLIC_SUPABASE_URL` — URL du projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — clé anon publique
- `ADMIN_PASSWORD` — mot de passe admin (côté serveur uniquement)

### 4. Lancer en local

```bash
npm run dev
```

- RSVP : [http://localhost:3000](http://localhost:3000)
- Admin : [http://localhost:3000/admin](http://localhost:3000/admin)

## Déploiement Vercel

1. Push le repo sur GitHub
2. Importer dans Vercel
3. Ajouter les 3 variables d'environnement dans Vercel → Settings → Environment Variables
4. Deploy
