# Feuille de route de Bos

À tenir à jour ici, jamais dans le `CLAUDE.md`. Le documentaliste la met à jour
en fin de `/cadrer`, `/construire` et `/livrer`.

**À FAIRE (prochaines sessions)**, dans l'ordre :

1. ~~Décrire Bos~~ **fait le 16/11** : section 1 du `CLAUDE.md` et
   `docs/contexte/produit.md`. Reste à choisir le premier usage à construire
   (quelle brique du parcours d'abord) : c'est le sujet du premier `/cadrer`.
2. **Finir la production Railway** : le service `bos` tourne déjà sur `main`
   (us-west2) ; manquent Postgres, les variables (`DATABASE_URL` en
   référence, `PGSSL=require`, `AUTH_SECRET`, `PORT=8080`, `PUBLIC_APP_URL`),
   un domaine et le choix de région (EU West comme le staging ?).
3. ~~Créer l'environnement `staging`~~ **fait le 17/11** (skill `railway-ops`).
4. **Protéger `main` sur GitHub** (merge par PR seulement, CI `check` exigée).
5. **`/cadrer` le premier sujet produit.**

**Fait** :

- 16/11 : structure et méthode reprises de Platform, squelette Next.js, CI
  (`docs/journal/2026-11-16-mise-en-place-structure.md`).
- 17/11 : environnement Railway `staging` (EU West, Postgres propre, branche
  `staging`, contrôle de santé `/api/health` vert).

**Attend Vincent ou Mickael** : le feu vert pour la production (point 2 :
Postgres facturé, région, domaine), la protection de `main` (point 4).
