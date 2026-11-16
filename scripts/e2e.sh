#!/usr/bin/env bash
# Test de fumee de bout en bout, dans le bac a sable :
#   Postgres local -> build -> next start -> parcours Playwright (scripts/e2e.mjs)
#   en 1440 px et 390 px, captures dans .verif/, aucun scroll horizontal,
#   aucune erreur de page.
# Variables : E2E_SKIP_BUILD=1 pour reutiliser .next ; E2E_PORT (3100).
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/pg-local.sh
PORT=${E2E_PORT:-3100}

pg_local_start
DB_URL=$(pg_local_db bos_e2e)

export DATABASE_URL="$DB_URL"
export AUTH_SECRET="e2e-secret-e2e-secret-e2e-secret-e2e"
export PUBLIC_APP_URL="http://localhost:$PORT"
export NODE_ENV=production
unset PGSSL

if [ "${E2E_SKIP_BUILD:-0}" != "1" ]; then
  echo "== build"
  npm run build > .verif-build.log 2>&1 || { tail -40 .verif-build.log; exit 1; }
fi

echo "== next start sur :$PORT"
# Un serveur d'un passage precedent garderait son schema en memoire alors que
# la base vient d'etre recreee : on refuse de demarrer sur un port occupe.
if curl -fsS "http://localhost:$PORT/api/health" >/dev/null 2>&1; then
  echo "le port $PORT est deja pris (un next start precedent tourne encore) : arrete-le d'abord" >&2
  exit 1
fi
npx next start -p "$PORT" > .verif-server.log 2>&1 &
# next renomme son processus en « next-server » et survit a la mort de npx :
# on tue par le port, c'est le seul repere sur.
trap 'fuser -k -TERM $PORT/tcp >/dev/null 2>&1 || true' EXIT
for i in $(seq 1 60); do
  if curl -fsS "http://localhost:$PORT/api/health" 2>/dev/null | grep -q '"ok":true'; then break; fi
  sleep 1
  if [ "$i" = 60 ]; then echo "le serveur ne repond pas"; tail -30 .verif-server.log; exit 1; fi
done

echo "== parcours Playwright"
E2E_BASE="http://localhost:$PORT" node scripts/e2e.mjs
