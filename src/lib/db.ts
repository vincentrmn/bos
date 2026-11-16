import { Pool } from "pg";

/**
 * Acces Postgres (Railway) et schema auto-cree par un `ensureSchema()`
 * idempotent (CREATE TABLE IF NOT EXISTS, ADD COLUMN IF NOT EXISTS), rejoue a
 * chaque demarrage. Toute route qui touche la base est `force-dynamic`.
 * Toute modification ici se rejoue avec `npm run migration-lab` avant le
 * commit (regle `.claude/rules/db-schema.md`).
 */

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var _schemaReady: Promise<void> | undefined;
}

export function getPool(): Pool {
  if (!global._pgPool) {
    global._pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === "require" ? { rejectUnauthorized: false } : undefined,
      max: 5,
    });
  }
  return global._pgPool;
}

async function createSchema(): Promise<void> {
  const pool = getPool();
  await pool.query(`
    -- Verrou consultatif tenu jusqu'a la fin de cette requete : Railway
    -- redemarre plusieurs instances a chaque deploiement, et deux CREATE TABLE
    -- IF NOT EXISTS concurrents peuvent lever une violation d'unicite dans le
    -- catalogue Postgres. Le verrou les fait passer l'une apres l'autre.
    SELECT pg_advisory_xact_lock(270411);

    -- Cles des semis de contenu deja joues (voir seedUneFois).
    CREATE TABLE IF NOT EXISTS seeds (
      cle TEXT PRIMARY KEY,
      fait_le TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await seed();
}

/**
 * Un semis de CONTENU ne tourne qu'une fois : l'insertion de la cle fait
 * verrou entre instances. Si le travail echoue, la cle est relachee pour que
 * la prochaine instance reessaie (sinon le semis sauterait pour toujours).
 */
export async function seedUneFois(cle: string, faire: () => Promise<void>): Promise<void> {
  const pool = getPool();
  const pris = await pool.query(
    `INSERT INTO seeds (cle) VALUES ($1) ON CONFLICT (cle) DO NOTHING RETURNING cle`,
    [cle]
  );
  if (pris.rowCount === 0) return;
  try {
    await faire();
  } catch (e) {
    await pool.query(`DELETE FROM seeds WHERE cle = $1`, [cle]);
    throw e;
  }
}

/** Semis de structure (a chaque demarrage) et de contenu (seedUneFois). Vide pour l'instant. */
async function seed(): Promise<void> {}

export function ensureSchema(): Promise<void> {
  if (!global._schemaReady) {
    global._schemaReady = createSchema().catch((e) => {
      global._schemaReady = undefined;
      throw e;
    });
  }
  return global._schemaReady;
}

export async function q<T = any>(text: string, params?: any[]): Promise<T[]> {
  await ensureSchema();
  const res = await getPool().query(text, params);
  return res.rows as T[];
}
