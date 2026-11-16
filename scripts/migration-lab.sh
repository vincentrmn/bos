#!/usr/bin/env bash
# Laboratoire de migration : rejoue ensureSchema() deux fois sur chaque etat,
# chacun dans une base neuve et un processus neuf.
#   vide : base vierge (le cas d'un nouvel environnement)
#   prod : une copie de la production, si PROD_DUMP pointe sur un dump SQL
# Une migration qui introduit un cas nouveau ajoute ici son etat mechant (une
# fixture SQL dans tests/lab/) et l'invariant correspondant dans
# tests/lab/migration.lab.ts. Chaque etat est choisi par MIGRATION_STATE.
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/pg-local.sh
pg_local_start
unset PGSSL
export AUTH_SECRET=lab
code=0
for etat in vide prod; do
  if [ "$etat" = "prod" ] && [ -z "${PROD_DUMP:-}" ]; then
    echo "-- prod : ignore (PROD_DUMP non fourni ; demander un dump pour rejouer sur la vraie base)"
    continue
  fi
  base="bos_lab_${etat//-/_}"
  DB_URL=$(pg_local_db "$base")
  case "$etat" in
    prod) pg_local_psql "-d $base -f $PROD_DUMP" >/dev/null ;;
  esac
  echo "-- $etat"
  if ! DATABASE_URL="$DB_URL" MIGRATION_STATE="$etat" npx vitest run --config vitest.lab.config.ts --reporter=dot 2>&1 | tail -8; then
    code=1
  fi
done
exit $code
