# Feuille de route de Bos

À tenir à jour ici, jamais dans le `CLAUDE.md`. Le documentaliste la met à jour
en fin de `/cadrer`, `/construire` et `/livrer`.

**À FAIRE (prochaines sessions)**, dans l'ordre :

1. ~~Décrire Bos~~ **fait le 16/11** : section 1 du `CLAUDE.md` et
   `docs/contexte/produit.md`. Reste à choisir le premier usage à construire
   (quelle brique du parcours d'abord) : c'est le sujet du premier `/cadrer`.
2. **Brancher Railway** (projet `bos`, vierge) : service relié à `main` de
   `vincentrmn/bos`, Postgres, variables (`DATABASE_URL` en référence,
   `PGSSL=require`, `AUTH_SECRET`, `PORT`, `PUBLIC_APP_URL`), domaine, région.
   Puis consigner l'état réel dans le skill `railway-ops`.
3. **Créer l'environnement `staging`** (un environnement Railway, avec son
   propre Postgres, branché sur la branche `staging`) pour que `/staging`
   fonctionne.
4. **Protéger `main` sur GitHub** (merge par PR seulement, CI `check` exigée).
5. **`/cadrer` le premier sujet produit.**

**Fait** :

- 16/11 : structure et méthode reprises de Platform, squelette Next.js, CI
  (`docs/journal/2026-11-16-mise-en-place-structure.md`).

**Attend Vincent ou Mickael** : la description de Bos (point 1), l'accès
Railway pour l'agent (point 2), la protection de `main` (point 4).
