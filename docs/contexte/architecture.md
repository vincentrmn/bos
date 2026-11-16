# Architecture de Bos

État au 16/11/2026 : le socle, sans produit. Ce document grandit avec les
plans ; une décision qui le change est d'abord écrite dans `docs/decisions.md`.

## Arborescence

- `src/app/` : pages et routes (App Router). `page.tsx` (accueil provisoire),
  `layout.tsx`, `globals.css` (les tokens de l'interface), `api/health/route.ts`.
- `src/lib/db.ts` : le pool `pg`, `ensureSchema()` idempotent rejoué à chaque
  démarrage sous verrou consultatif, `seedUneFois()`, `q()`.
- `src/lib/url.ts` : `publicAppUrl()` et `urlPublique()`, seule source des URL
  absolues construites côté serveur.
- `tests/*.test.ts` : tests unitaires vitest (lancés par `npm run check`).
- `tests/lab/` : laboratoire de migration (lancé par `npm run migration-lab`).
- `scripts/` : `pg-local.sh` (Postgres du bac à sable), `e2e.sh` et `e2e.mjs`
  (parcours au navigateur), `migration-lab.sh`.
- `.claude/` : agents, skills, portiques, règles par chemin.
- `docs/` : contexte, décisions, feuille de route, plans, journal.

## Données

Une seule table : `seeds` (clés des semis de contenu joués une fois). Le
modèle de Bos se pose au premier plan qui en a besoin.

## Routes

| Route | Rôle | Réponse |
|---|---|---|
| `GET /` | accueil provisoire | 200 |
| `GET /api/health` | base joignable et schéma rejoué | 200 `{ ok: true }`, 500 sinon |
