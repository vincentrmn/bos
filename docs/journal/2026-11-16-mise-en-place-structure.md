# Session « mise en place de la structure » (16/11/2026)

## Ce qui a été décidé
- Reprendre de `vincentrmn/platform` la structure et la méthode seulement :
  rien du produit Platform, aucune de ses leçons (`docs/decisions.md`, 16/11).
- Même stack que Platform ; décideurs Vincent et Mickael ; hébergement sur le
  projet Railway `bos`, vierge.

## Ce qui a été fait
- Partie commune du workflow recopiée à l'identique de Platform (version
  `korr-workflow ed188f3`) : les cinq sous-agents, les skills `cadrer`,
  `construire`, `livrer`, `journal`, `installer`, `staging`, les cinq
  portiques, `settings.json`, la CI `check`, les gabarits de plan et de journal.
- Mémoire propre à Bos écrite neuve : `CLAUDE.md` (sous 200 lignes),
  `docs/decisions.md`, `docs/feuille-de-route.md`, `docs/contexte/architecture.md`,
  règles `api-routes` et `db-schema` (règles absolues de la stack, sans pièges),
  skills `verif-locale` et `railway-ops`.
- Squelette Next.js : accueil, `GET /api/health`, `src/lib/db.ts`
  (`ensureSchema()` sous verrou, `seedUneFois()`), `src/lib/url.ts`, un test
  unitaire, le laboratoire de migration (états vide et prod), l'e2e (1440 et
  390 px). `package-lock.json` repris de Platform, mêmes dépendances.

## Ce qui a été vérifié (et comment)
- Agents identiques à ceux de Platform : `diff -r` sans écart.
- `CLAUDE.md` sous 200 lignes : `wc -l`.
- La CI `check` de la PR est la seule exécution de typecheck, lint, tests et build.

## Ce qui n'a pas pu être vérifié
- `npm run check`, `npm run e2e` et `npm run migration-lab` en local : le
  registre npm était inaccessible depuis le bac à sable (`npm ci --offline`
  échoue sur `ENOTCACHED`), donc aucun `node_modules`.
- `korr-workflow` n'était pas accessible depuis la session : la partie commune
  vient de la copie installée dans Platform, pas du dépôt commun.
- Les portiques de `.claude/settings.json` n'étaient pas chargés dans cette
  session (ouverte hors du dépôt) : ils n'ont pas été éprouvés ici.

## Leçons durables (reportées dans les règles ou les skills)
- Sans accès au registre npm, la CI GitHub fait foi : noté dans `verif-locale`.

## Prochaine étape
Décrire Bos dans le `CLAUDE.md`, brancher Railway et le staging, protéger
`main`, puis `/cadrer` le premier sujet produit (`docs/feuille-de-route.md`).
