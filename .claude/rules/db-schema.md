---
paths:
  - "src/lib/db.ts"
  - "tests/lab/**"
  - "scripts/migration-lab.sh"
---

# Schéma Postgres, migrations et semis

## Règles absolues

- `ensureSchema()` est idempotent (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN
  IF NOT EXISTS`, `DROP ... IF EXISTS`) et rejoué à chaque démarrage, sous
  verrou consultatif. S'il échoue, **toute route qui touche la base passe en
  500**.
- Toute migration se rejoue avec `npm run migration-lab` avant le commit, sur
  une base vide, sur une copie de la production (`PROD_DUMP`) dès qu'il y a
  une production, et sur les états méchants qu'elle rend possibles (migration
  interrompue, doublons, collision de renommage). Un état manquant s'ajoute
  au laboratoire (fixture SQL dans `tests/lab/`) avant la migration.
- Ordre d'une migration : les anciens index partent avant un renommage ; un
  renommage passe avant le semis qui insérerait le nouveau nom.
- Semis : seuls les semis de STRUCTURE tournent à chaque démarrage. Tout semis
  de CONTENU passe par `seedUneFois(cle, fn)`, qui relâche sa clé si le
  travail échoue. Rien de ce qui part chez quelqu'un (un envoi) n'est semé.
- « Tous » est un drapeau explicite, jamais l'absence de lignes : une
  suppression ne doit jamais élargir une audience.
- Un backtick dans un commentaire SQL termine le littéral gabarit de
  `createSchema()` : guillemets français dans ces commentaires.
- Après tout changement ici : `/api/health` à 200 en prod prouve que la
  migration a rejoué sans échouer.

## Pièges vérifiés

Aucun pour l'instant : le documentaliste ajoute ici les leçons vérifiées sur Bos.
