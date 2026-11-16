# Décisions tranchées

Une ligne par arbitrage, daté, avec la raison en quelques mots. Le récit est
dans `docs/journal/`. On n'y revient pas sans une raison nouvelle.

- **16/11** Bos reprend la structure et la méthode de `vincentrmn/platform`
  (boucles `/cadrer`, `/construire`, `/staging`, `/livrer`, `/journal`,
  sous-agents, portiques, CI) sans rien reprendre de son produit ni de ses
  leçons : les deux projets n'ont rien en commun hors la manière de travailler.
- **16/11** Même stack que Platform : Next.js 14 App Router, TypeScript, CSS
  maison, PostgreSQL via `pg`, Auth.js v5 ; les commandes `check`, `e2e`,
  `migration-lab` fonctionnent donc à l'identique.
- **16/11** Deux décideurs, Vincent et Mickael : l'un ou l'autre valide un
  plan et teste sur le staging.
- **16/11** Hébergement : le projet Railway `bos`, déjà créé et vierge.
