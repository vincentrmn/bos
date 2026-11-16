---
name: railway-ops
description: Déployer et exploiter Bos sur Railway (projet bos : services, variables, domaine, logs, vérification après push, staging). À charger pour tout déploiement, toute variable d'environnement, tout incident en prod, ou pour poser un domaine.
---

# Railway et la mise en ligne de Bos

## Ce qui existe (16/11/2026)
- Projet Railway `bos`, créé et vierge : aucun service, aucune base, aucun
  domaine. Cette section se remplit avec l'état réel, vérifié, à la mise en
  ligne (point 2 de `docs/feuille-de-route.md`).

## Ce qu'il faut poser (première mise en ligne)
- Service `bos` relié à la branche `main` de `vincentrmn/bos`, auto-deploy,
  `PORT` posé explicitement et aligné avec le port cible du domaine.
- Service `Postgres` dans le même environnement ; `DATABASE_URL` en référence
  `${{Postgres.DATABASE_URL}}`, `PGSSL=require`.
- `AUTH_SECRET`, `PUBLIC_APP_URL` (seulement quand le domaine est actif, sinon
  une redirection vers l'hôte public tuerait la seule URL utilisable).
- Région choisie une fois pour tous les services, notée dans `docs/decisions.md`.
- Jamais de valeur de variable dans le code, les docs ou ce fichier.

## Procédure après chaque push sur `main`
1. Poller le déploiement jusqu'à `SUCCESS` (outil Railway de la session, ou API
   GraphQL avec un jeton demandé à Vincent ou Mickael, jamais stocké), toutes
   les 30 s, 10 minutes au plus. Un échec se lit dans ses logs avant toute action.
2. `GET <adresse de prod>/api/health` → 200 (prouve que `ensureSchema()` a rejoué).
3. Routes gardées : réponse attendue sans session (401 ou 307).
4. Hash du CSS servi si la passe touchait `globals.css`.
5. Le rendu connecté reste à confirmer par Vincent ou Mickael.

## Staging
- Un ENVIRONNEMENT Railway `staging` (pas un service de plus dans `production`,
  qui tournerait sur la base de prod), avec son propre Postgres, branché sur la
  branche GitHub `staging`. La branche `staging` est un pointeur déplacé par
  `/staging <PR>`, jamais une branche de travail.
- Variables copiées de la production sauf `PUBLIC_APP_URL` (adresse du staging)
  et `DATABASE_URL`, reposée en référence au Postgres du staging.
- Suivi d'un déploiement staging : liste des déploiements de l'environnement
  `staging`, puis `GET <adresse staging>/api/health`.

## Rappels de la stack
- `next start -H ::` en prod (le proxy joint le conteneur en IPv6) ; en local
  sans le flag.
- `req.nextUrl.origin` rend l'adresse d'écoute interne derrière le proxy :
  `PUBLIC_APP_URL` partout (`src/lib/url.ts`).
- Une migration qui échoue met toute la prod en 500 : `.claude/rules/db-schema.md`.

## Leçons durables
Aucune pour l'instant : on n'y écrit que ce qui a été vérifié sur Bos.
