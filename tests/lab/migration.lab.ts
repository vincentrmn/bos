import { describe, it, expect, afterAll } from "vitest";
import { Pool } from "pg";

/**
 * Rejoue ensureSchema() DEUX FOIS sur l'etat de base choisi par
 * MIGRATION_STATE, dans un module neuf a chaque fois, et verifie apres chaque
 * passe les invariants du schema. Les etats sont prepares par
 * scripts/migration-lab.sh :
 *   vide : base vierge, un nouvel environnement ;
 *   prod : une copie de la production (PROD_DUMP).
 * Quand une migration introduit un cas nouveau (renommage, collision), on
 * ajoute ici son etat mechant, avec sa fixture SQL dans tests/lab/.
 */
const etat = process.env.MIGRATION_STATE || "vide";
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

// Les tables que le schema doit laisser, triees par points de code.
const ATTENDUES = ["seeds"];

async function schemaNeuf() {
  // Module neuf a chaque appel : ensureSchema() se souvient d'avoir tourne.
  const { vi } = await import("vitest");
  vi.resetModules();
  (global as any)._schemaReady = undefined;
  (global as any)._pgPool = undefined;
  const db = await import("@/lib/db");
  try {
    await db.ensureSchema();
  } finally {
    await db.getPool().end();
  }
}

async function tables(): Promise<string[]> {
  const r = await pool.query<{ t: string }>(
    `SELECT table_name AS t FROM information_schema.tables
     WHERE table_schema = 'public' ORDER BY table_name COLLATE "C"`
  );
  return r.rows.map((x) => x.t);
}

afterAll(async () => {
  await pool.end();
});

describe(`migration, etat ${etat}`, () => {
  for (const passe of [1, 2]) {
    it(`passe ${passe} : ensureSchema() reussit et laisse les tables attendues`, async () => {
      await schemaNeuf();
      const t = await tables();
      for (const a of ATTENDUES) expect(t).toContain(a);
    });
  }
});
