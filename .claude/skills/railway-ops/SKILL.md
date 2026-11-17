---
name: railway-ops
description: Déployer et exploiter Bos sur Railway (projet bos : services, variables, domaine, logs, vérification après push, staging). À charger pour tout déploiement, toute variable d'environnement, tout incident en prod, ou pour poser un domaine.
---

# Railway et la mise en ligne de Bos

## Ce qui existe (vérifié le 17/11/2026)
- Projet Railway `bos` (`060ce165-e7ce-4310-b50f-53fc2f33d668`), dans l'espace
  de Vincent. Mickael y est membre « can edit » au niveau du projet : il ne
  voit pas l'espace, donc le connecteur Railway ne liste pas le projet ;
  toujours passer l'identifiant du projet.
- **production** (`e3c00182-a166-4c8b-a8fd-eec4169fc106`), région `ams`
  (EU West) depuis le 17/11 : service `bos`
  (`d234373f-815c-403e-9cb0-50d838ec54dd`) sur `main`, auto-deploy, contrôle
  de santé `/api/health` (délai 120 s), adresse
  https://bos-production-19c412da.up.railway.app ; service `Postgres-Q4iS`
  (`594e9d6d-8edd-4712-a889-326cfabe68fb`, nom suffixé car `Postgres` est pris
  par le staging) et son volume. Variables : `DATABASE_URL`
  (`${{Postgres-Q4iS.DATABASE_URL}}`), `PGSSL`, `PORT=8080`, `AUTH_SECRET`,
  `PUBLIC_APP_URL`. Pas encore de domaine personnalisé.
- **staging** (`928a302a-6931-4be0-83b1-6e43204c5ead`), région `ams`
  (EU West) : service `bos-qqJ4` (`018b5fe3-ddef-408e-943e-c086072781c4`) sur
  la branche `staging`, auto-deploy, contrôle de santé `/api/health` (délai
  120 s), adresse https://bos-qqj4-staging.up.railway.app ; service
  `Postgres` (`a50eb609-8640-4eac-8bdc-aece8ff5a695`) et son volume.
  Variables : `DATABASE_URL` (référence au Postgres du staging), `PGSSL`,
  `PORT=8080`, `AUTH_SECRET`, `PUBLIC_APP_URL`.

## Leçons de la mise en place (17/11)
- Le connecteur Railway ne sait pas créer un environnement : c'est fait à la
  main dans le tableau de bord (« New Environment », vide de préférence).
- L'agent Railway crée un service nouveau dans un environnement vide (il ne
  sait pas y rattacher un service existant) et lui impose un suffixe quand le
  nom est pris : d'où `bos-qqJ4`. Le renommer se fait dans le tableau de bord.
- Un `AUTH_SECRET` se fait générer par l'agent Railway (variable posée en
  attente, sans valeur affichée) : jamais de valeur dans un appel d'outil.
- Un nom de service est unique dans tout le projet, même entre environnements :
  une référence de variable vise le nom réel (`Postgres-Q4iS` en production).
- Le bac à sable ne joint pas les adresses `*.up.railway.app` : la preuve d'un
  `/api/health` à 200 est le contrôle de santé Railway (déploiement en
  `SUCCESS` seulement si la route répond 200).

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
