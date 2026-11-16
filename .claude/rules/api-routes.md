---
paths:
  - "src/app/api/**"
  - "src/middleware.ts"
  - "src/lib/url.ts"
---

# Routes API, auth et redirections

## Règles absolues

- `export const dynamic = "force-dynamic"` sur **toute** route GET qui touche
  la base (sinon elle est prérendue au build, sans base).
- Try-catch et réponse JSON d'erreur dans toutes les routes : un client qui
  attend du JSON et reçoit une page d'erreur reste bloqué en chargement.
- Toute URL ou redirection construite côté serveur repart de `PUBLIC_APP_URL`
  (`src/lib/url.ts`) : derrière le proxy de l'hébergeur, `req.nextUrl.origin`
  est l'adresse d'écoute interne.
- Une route qui touche une donnée vérifie la session et le droit d'accès
  avant toute lecture ; aucun jeton ni URL signée ne sort côté client.
- Une route déclenchée de l'extérieur est gardée par un secret en en-tête,
  jamais en paramètre d'URL.
- Le middleware, s'il existe, est `src/middleware.ts` (à la racine il est ignoré).
- Tester une route gardée en curl : 401 sans session, 401 avec un mauvais
  secret, 200 avec.

## Pièges vérifiés

Aucun pour l'instant : le documentaliste ajoute ici les leçons vérifiées sur Bos.
