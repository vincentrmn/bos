# CLAUDE.md : Bos

Lu au début de chaque session. **Tenu sous 200 lignes** : ici les règles de tous
les jours et la carte de la mémoire. Le récit des sessions est dans
`docs/journal/`, les leçons par zone de code dans `.claude/rules/` (chargées
quand on touche ces fichiers), les références dans `.claude/skills/`.

## 1. Le projet en dix lignes

**Bos** rend disponibles des services aux acteurs qui gravitent autour d'un
bâtiment (occupants, locataires, propriétaires, bailleurs, maintenance,
électriciens) grâce à des capteurs et actionneurs posés dans le bâtiment :
ombrage automatique, monitoring énergétique, ouverture des fenêtres, sécurité
intrusion. Le parcours : un **configurateur** en ligne (données du bâtiment,
choix des services), un **package d'équipements** calculé par la plateforme,
la **commande** en ligne, la commande automatique aux fournisseurs (prix
négociés), un **plan d'exécution** validé par le gestionnaire, la réception et
le **commissionnement**, la pose en **plug and play** (client ou électricien
partenaire), puis les services dans l'**interface client** et l'**app mobile**.
Un nouveau service sans équipement de plus est actif dès la commande. Exigence
première : hyper simple pour l'utilisateur final. Détail : `docs/contexte/produit.md`.

Structure et méthode reprises le 16/11/2026 de `vincentrmn/platform` (workflow
`korr-workflow`) ; aucun code ni aucune leçon produit n'en vient : les deux
projets n'ont rien en commun hors la manière de travailler.

## 2. Stack et commandes

- Next.js 14.2 App Router, tout sous `src/`, TypeScript, CSS maison
  (`src/app/globals.css`, aucune lib UI), PostgreSQL via `pg`, Auth.js v5
  (dépendance posée, pas encore branchée).
- `npm run check` (typecheck, lint, tests, build) : DOIT passer avant tout
  commit ; un portique (`.claude/hooks/garde-commit.sh`) refuse sinon. Toute
  sortie de build va dans un fichier, jamais pipée dans `head` ou `grep`.
- `npm run e2e` : parcours de fumée au navigateur (base locale, 1440 et
  390 px, captures dans `.verif/`). `npm run migration-lab` : rejoue le schéma
  sur base vide et états méchants (plus `PROD_DUMP=<dump.sql>` pour la prod).
- Portiques actifs (`.claude/settings.json`) : refus d'un push sur `main`,
  d'un secret, d'un `CLAUDE.md` de plus de 200 lignes ; typecheck après
  chaque édition TypeScript. Pour éditer un hook : l'outil d'écriture de
  fichiers, jamais un heredoc Bash. CI GitHub Actions : `check` sur chaque PR.
- `npm start` = `next start -H ::` (prod seulement ; en local, sans le flag).
- Schéma auto-créé par `ensureSchema()` (`src/lib/db.ts`), idempotent.
- Vérification locale (Postgres, Playwright 1440 px et 390 px) : skill `verif-locale`.

## 3. Règles absolues

- Toute route GET qui touche la base : `export const dynamic = "force-dynamic"`.
  Toute route API : try-catch et réponse JSON d'erreur.
- Aucun secret dans le code, les commits, les docs ou ce fichier. Variables
  Railway et `.env.local` seulement.
- Aucun identifiant de modèle dans les commits, PR, code ou commentaires.
- Interface : tokens de `globals.css` uniquement, jamais de hex en dur dans un
  composant ; aucun tiret cadratin, aucun point médian, aucun emoji.
- Honnêteté : ne jamais présenter du fictif comme réel ; une donnée de
  démonstration porte un badge « Démo ».
- Toute URL construite côté serveur repart de `PUBLIC_APP_URL`
  (`src/lib/url.ts`), jamais de `req.nextUrl.origin`.
- Un semis de contenu tourne une seule fois (`seedUneFois`) ; une migration
  se rejoue sur une copie de la prod avant tout push (`.claude/rules/db-schema.md`).

## 4. Architecture, en bref

- Une seule app Next.js. Rester mince : quand un service existe, on
  l'embarque ; quand une API suffit, on lit et on relaie sans stocker.
- Données : seule la table `seeds` existe (mécanisme `seedUneFois`). Le
  modèle de Bos se pose au premier plan.
- Routes : `GET /api/health` (base et schéma). Détails :
  `docs/contexte/architecture.md`.

## 5. Infra

Railway : projet `bos`. `staging` en ligne depuis le 17/11 (EU West, Postgres,
branche `staging`) ; `production` : service sur `main` sans base ni domaine. Après chaque push sur `main` : **poller le
déploiement jusqu'à `SUCCESS`**, puis health 200 et routes gardées.
Procédures, variables et leçons : skill `railway-ops`.

## 6. Conventions de travail avec Vincent et Mickael (strictes)

- **Deux décideurs : Vincent et Mickael.** Partout où les skills et agents
  communs (recopiés de `korr-workflow`) disent « Vincent », lire « Vincent ou
  Mickael » : l'un ou l'autre valide un plan, teste sur le staging, tranche
  une question de métier.
- **Ils ne tapent aucune commande.** Claude exécute tout (build, git, npm,
  Railway). Ils travaillent depuis claude.ai/code.
- Français concis, décisions tranchées et justifiées brièvement, seulement les
  questions bloquantes. **Proposition validée avant de coder les gros morceaux.**
- Workflow git : branche de session → `check` → commit clair en français →
  push → PR squash-merge vers `main`. Claude merge les lots en cours sans
  demander (dès que la CI est verte) et prévient quand tout est fini.
- Les boucles (dépôt commun `korr-workflow`, installées ici) : `/cadrer
  <sujet>` écrit un plan validé dans `docs/plans/` ; `/construire <plan>`
  le construit en session neuve (un critère à la fois avec preuve,
  `relecteur` jusqu'à RAS, `migrateur` si le schéma change, `verificateur`
  PASS, PR) ; `/staging <PR>` le déploie sur le staging pour qu'ils le
  testent ; `/livrer <PR>` merge, vérifie en ligne, consigne ; `/journal`
  consigne une session. Les sous-agents qui jugent n'ont pas d'outil
  d'écriture (leur liste d'outils). `/installer` resynchronise la partie
  commune. Tout ce qui dépasse la retouche passe par un plan.
- Honnêteté directe sur les erreurs et les limites. Vérifier l'état réel
  (code, prod, DNS) plutôt que supposer.
- **En fin de session** : une entrée `docs/journal/AAAA-MM-JJ-<sujet>.md`
  (ce qui a été fait, vérifié, appris) ; une leçon durable va dans la règle du
  chemin concerné ou dans le skill, avec accord de Vincent ou Mickael ; une
  décision va dans `docs/decisions.md`. Ce fichier ne grandit pas.

## 7. Carte de la mémoire

| Où | Quoi |
|---|---|
| `.claude/rules/api-routes.md` | routes, auth, redirections |
| `.claude/rules/db-schema.md` | schéma, migrations, semis |
| skill `railway-ops` | déploiement, variables, domaine, staging |
| skill `verif-locale` | lancer et vérifier dans le bac à sable (e2e, migration-lab) |
| skill `staging` | `/staging <PR>` : déployer une PR sur l'environnement staging |
| `.claude/agents/`, `.claude/hooks/`, skills `cadrer`, `construire`, `livrer`, `journal`, `installer`, `staging` | partie commune du workflow, recopiée depuis `korr-workflow` (version dans `.claude/workflow-version`) ; ne pas éditer ici |
| `docs/plans/` | les plans validés, un par sujet, colonne « État » tenue par `/construire` (gabarit `.gabarit.md`) |
| `docs/contexte/` | le produit (`produit.md`), l'architecture |
| `docs/decisions.md` | les arbitrages tranchés, datés |
| `docs/feuille-de-route.md` | à faire, prochaine étape, ce qui attend Vincent et Mickael |
| `docs/journal/` | une entrée par session, jamais chargée (gabarit `.gabarit.md`) |

## 8. Où on en est (16/11/2026)

Socle posé (PR de mise en place) : workflow complet, squelette Next.js qui
répond sur `/` et `/api/health`, CI `check`. Produit décrit
(`docs/contexte/produit.md`). Staging en ligne (17/11). Prochaine étape
(`docs/feuille-de-route.md`) : finir la production Railway, puis `/cadrer`
la première brique du parcours.
