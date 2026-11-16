---
name: verif-locale
description: Lancer et vérifier Bos dans le bac à sable (Postgres local, build, next start, Playwright 1440 px et 390 px, captures) et les pièges du bac à sable. À charger avant toute vérification visuelle, tout test de bout en bout, ou quand un build ou une page se comporte bizarrement en local.
---

# Vérifier Bos en local, dans le bac à sable

## En une commande
- `npm run check` : typecheck, lint, tests vitest (`tests/*.test.ts`), build.
- `npm run e2e` : `scripts/e2e.sh` fait tout ce qui suit (Postgres local via
  `scripts/pg-local.sh`, build, `next start` sur le port 3100, `GET /api/health`,
  chaque page de `scripts/e2e.mjs` en 1440 px et 390 px, captures dans `.verif/`,
  refus de tout scroll horizontal en nommant l'élément coupable, refus de toute
  erreur de page). `E2E_SKIP_BUILD=1` réutilise le build précédent. Chaque plan
  qui touche l'interface ajoute ses pages et ses scénarios dans `scripts/e2e.mjs`.
- `npm run migration-lab` : `scripts/migration-lab.sh` rejoue `ensureSchema()`
  deux fois dans un processus neuf par état (`tests/lab/migration.lab.ts`) :
  base vide, et copie de prod si `PROD_DUMP` pointe sur un dump SQL. Les états
  méchants s'ajoutent avec les migrations qui les rendent possibles.
- Le serveur de test est tué par le port (`fuser -k 3100/tcp`) : `next`
  renomme son processus en `next-server` et survit à la mort de `npx`.

## À la main, si besoin
1. Postgres local : `source scripts/pg-local.sh; pg_local_start; pg_local_db <nom>`
   (serveur sous l'utilisateur `postgres`, port 5498, données dans `/tmp/pg-bos`).
2. `.env.local` (jamais committé) : `DATABASE_URL`, `AUTH_SECRET`, `PUBLIC_APP_URL`.
3. `npm run build > /tmp/build.log 2>&1` puis lire le fichier. Puis `npx next start`
   (SANS `-H ::`, qui plante sans IPv6).
4. Playwright (Chromium pré-installé, `/opt/pw-browsers`) : captures à 1440 px et
   390 px de chaque page touchée, lues ensuite avec l'outil de lecture d'image.
   Pas de scroll horizontal, pas d'erreur console.

## Pièges du bac à sable
- **Ne jamais piper `npm run build`** dans `head`/`grep` : le SIGPIPE tue le build
  après la compilation, `.next/static` reste vide ou garde les chunks précédents
  (page sans CSS, `ChunkLoadError`). Rediriger vers un fichier, puis lire.
- **Rebâtir pendant que `next start` tourne** sert des références mortes (CSS et
  chunks en 400, React n'hydrate pas). Arrêter, construire, redémarrer.
- Le navigateur du bac à sable n'a pas de réseau sortant : un service tiers
  embarqué ne s'affiche pas ici ; `curl` et `fetch` côté serveur peuvent passer.
- Le registre npm peut être inaccessible selon les réglages réseau du compte :
  sans `node_modules`, ni `check` ni l'e2e ne tournent ; la CI GitHub fait alors foi,
  et on le dit au lieu de présenter le code comme vérifié.
- Mesurer plutôt que relire : les requêtes en échec, le hash du CSS servi.
