#!/usr/bin/env bash
# Postgres local du bac a sable : demarre (ou reutilise) un serveur sous
# l'utilisateur postgres, sur un port libre, et imprime l'URL de connexion.
# Usage : source scripts/pg-local.sh ; pg_local_start ; pg_local_db <nom>
set -euo pipefail
PGBIN=${PGBIN:-/usr/lib/postgresql/16/bin}
PGDATA_LOCAL=${PGDATA_LOCAL:-/tmp/pg-bos}
PGPORT_LOCAL=${PGPORT_LOCAL:-5498}

pg_run() { su postgres -s /bin/bash -c "$*"; }

pg_local_start() {
  if [ ! -d "$PGDATA_LOCAL/base" ]; then
    mkdir -p "$PGDATA_LOCAL" && chown postgres:postgres "$PGDATA_LOCAL"
    pg_run "$PGBIN/initdb -D $PGDATA_LOCAL --auth=trust -U postgres" >/dev/null
  fi
  if ! pg_run "$PGBIN/pg_ctl -D $PGDATA_LOCAL status" >/dev/null 2>&1; then
    pg_run "$PGBIN/pg_ctl -D $PGDATA_LOCAL -o '-p $PGPORT_LOCAL -k /tmp' -l $PGDATA_LOCAL/log start" >/dev/null
  fi
  for i in $(seq 1 30); do
    pg_run "$PGBIN/pg_isready -h /tmp -p $PGPORT_LOCAL" >/dev/null 2>&1 && return 0
    sleep 0.5
  done
  echo "Postgres local ne repond pas" >&2; return 1
}

# Cree (ou recree) une base vide et imprime son URL.
pg_local_db() {
  local name="$1"
  pg_run "$PGBIN/dropdb -h /tmp -p $PGPORT_LOCAL --if-exists $name" >/dev/null
  pg_run "$PGBIN/createdb -h /tmp -p $PGPORT_LOCAL $name" >/dev/null
  echo "postgres://postgres@localhost:$PGPORT_LOCAL/$name"
}

pg_local_psql() { pg_run "$PGBIN/psql -h /tmp -p $PGPORT_LOCAL -v ON_ERROR_STOP=1 -q $*"; }
