import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

function getClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("Turso database is not configured.");
  }

  if (!client) {
    client = createClient({ url, authToken });
  }

  return client;
}

async function ensureSchema() {
  const db = getClient();
  const tableInfo = await db.execute(`PRAGMA table_info(demo_signups)`);
  const columns = tableInfo.rows.map((row) => String(row.name));

  if (columns.length === 0) {
    await db.execute(`
      CREATE TABLE demo_signups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studio_name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      )
    `);
    return;
  }

  if (!columns.includes("studio_name")) {
    await db.batch([
      { sql: `ALTER TABLE demo_signups RENAME TO demo_signups_legacy` },
      {
        sql: `
          CREATE TABLE demo_signups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studio_name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
          )
        `,
      },
    ]);
  }
}

export async function getDb() {
  if (!schemaReady) {
    schemaReady = ensureSchema();
  }

  await schemaReady;
  return getClient();
}

export type DemoSignupInput = {
  studioName: string;
  email: string;
};

export async function saveDemoSignup(input: DemoSignupInput) {
  const db = await getDb();

  await db.execute({
    sql: `
      INSERT INTO demo_signups (studio_name, email)
      VALUES (?, ?)
    `,
    args: [input.studioName, input.email],
  });
}
