# Session « staging Railway » (17/11/2026)

## Ce qui a été fait
- Connecteur Railway relié au compte de Mickael ; le projet `bos` est atteint
  par son identifiant (membre au niveau du projet, pas de l'espace).
- Branche GitHub `staging` créée depuis `main`.
- Environnement `staging` créé par Mickael dans le tableau de bord (vide),
  puis peuplé : service `bos-qqJ4` sur la branche `staging`, Postgres et son
  volume, région `ams`, variables, adresse Railway, contrôle de santé
  `/api/health`.

## Ce qui a été vérifié (et comment)
- Déploiement du staging en `SUCCESS` avec le contrôle de santé
  `/api/health` : la route a répondu 200, donc la base répond et
  `ensureSchema()` a rejoué.
- La production n'a pas été touchée.

## Ce qui n'a pas pu être vérifié
- Un appel direct à l'adresse du staging : le bac à sable ne joint pas
  `*.up.railway.app`.

## Leçons durables
Reportées dans le skill `railway-ops` (création d'environnement à la main,
suffixe imposé au nom du service, preuve par le contrôle de santé).

## Suite : production (même soir)
- Postgres `Postgres-Q4iS` ajouté, service `bos` et base passés en `ams`,
  variables posées (`AUTH_SECRET` généré par l'agent Railway), adresse
  Railway générée, contrôle de santé `/api/health`.
- Vérifié : déploiement de production en `SUCCESS` avec le contrôle de santé.

## Prochaine étape
Protéger `main`, éventuellement un domaine personnalisé, puis `/cadrer` la
première brique du parcours.
