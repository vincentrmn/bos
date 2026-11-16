# Bos

Voir `CLAUDE.md` (document maître du projet) : stack, règles, méthode de
travail et carte de la mémoire.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # renseigner DATABASE_URL, AUTH_SECRET, PUBLIC_APP_URL
npm run build && npx next start
```

Le schéma Postgres est créé automatiquement au premier accès
(`src/lib/db.ts`, `ensureSchema()` idempotent).

## Commandes

- `npm run check` : typecheck, lint, tests, build (obligatoire avant tout commit).
- `npm run e2e` : parcours de fumée au navigateur, captures dans `.verif/`.
- `npm run migration-lab` : rejoue le schéma sur plusieurs états de base.
