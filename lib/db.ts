import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

const ANALYTICS_EVENT_NAMES = [
  "page_view",
  "book_demo_click",
  "scroll_depth",
  "session_end",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return (ANALYTICS_EVENT_NAMES as readonly string[]).includes(value);
}

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

  await db.execute(`
    CREATE TABLE IF NOT EXISTS demo_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studio_name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `);

  const tableInfo = await db.execute(`PRAGMA table_info(demo_signups)`);
  const columns = tableInfo.rows.map((row) => String(row.name));

  if (columns.length > 0 && !columns.includes("studio_name")) {
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

  await db.batch([
    {
      sql: `
        CREATE TABLE IF NOT EXISTS analytics_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          visitor_id TEXT NOT NULL,
          session_id TEXT NOT NULL,
          event_name TEXT NOT NULL,
          properties TEXT,
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
        )
      `,
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events(session_id)`,
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_events_name ON analytics_events(event_name)`,
    },
    {
      sql: `CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at)`,
    },
  ]);
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

export type AnalyticsEventInput = {
  visitorId: string;
  sessionId: string;
  eventName: AnalyticsEventName;
  properties?: Record<string, string | number>;
};

export async function insertAnalyticsEvent(input: AnalyticsEventInput) {
  const db = await getDb();

  await db.execute({
    sql: `
      INSERT INTO analytics_events (visitor_id, session_id, event_name, properties)
      VALUES (?, ?, ?, ?)
    `,
    args: [
      input.visitorId,
      input.sessionId,
      input.eventName,
      input.properties ? JSON.stringify(input.properties) : null,
    ],
  });
}

export type AnalyticsMetrics = {
  uniqueVisitors: number;
  totalSessions: number;
  bookDemoClicks: number;
  uniqueClickers: number;
  demoSignups: number;
  signupRate: number;
  clickRate: number;
  avgTimeOnPageMs: number;
  bounceRate: number;
  scrollDepth: {
    p25: number;
    p50: number;
    p75: number;
    p100: number;
  };
  ctaBreakdown: { location: string; clicks: number }[];
  signupsOverTime: { date: string; count: number }[];
  sessionsOverTime: { date: string; count: number }[];
};

export type RecentSignup = {
  studioName: string;
  email: string;
  createdAt: string;
};

function defaultDateFrom(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getAnalyticsMetrics(dateRange?: {
  from: string;
  to?: string;
}): Promise<AnalyticsMetrics> {
  const db = await getDb();
  const from = dateRange?.from ?? defaultDateFrom();

  const [
    visitorsResult,
    sessionsResult,
    clickSessionsResult,
    clickVisitorsResult,
    signupsResult,
    avgDurationResult,
    bounceResult,
    scroll25,
    scroll50,
    scroll75,
    scroll100,
    ctaResult,
    signupsOverTimeResult,
    sessionsOverTimeResult,
  ] = await db.batch([
    {
      sql: `
        SELECT COUNT(DISTINCT visitor_id) AS count
        FROM analytics_events
        WHERE event_name = 'page_view' AND created_at >= ?
      `,
      args: [from],
    },
    {
      sql: `
        SELECT COUNT(DISTINCT session_id) AS count
        FROM analytics_events
        WHERE event_name = 'page_view' AND created_at >= ?
      `,
      args: [from],
    },
    {
      sql: `
        SELECT COUNT(DISTINCT session_id) AS count
        FROM analytics_events
        WHERE event_name = 'book_demo_click' AND created_at >= ?
      `,
      args: [from],
    },
    {
      sql: `
        SELECT COUNT(DISTINCT visitor_id) AS count
        FROM analytics_events
        WHERE event_name = 'book_demo_click' AND created_at >= ?
      `,
      args: [from],
    },
    {
      sql: `
        SELECT COUNT(*) AS count
        FROM demo_signups
        WHERE created_at >= ?
      `,
      args: [from],
    },
    {
      sql: `
        SELECT AVG(CAST(json_extract(properties, '$.duration_ms') AS INTEGER)) AS avg_ms
        FROM analytics_events
        WHERE event_name = 'session_end' AND created_at >= ?
      `,
      args: [from],
    },
    {
      sql: `
        WITH sessions AS (
          SELECT DISTINCT session_id
          FROM analytics_events
          WHERE event_name = 'page_view' AND created_at >= ?
        ),
        session_stats AS (
          SELECT
            s.session_id,
            SUM(CASE WHEN e.event_name = 'page_view' THEN 1 ELSE 0 END) AS page_views,
            MAX(
              CASE
                WHEN e.event_name = 'session_end'
                THEN CAST(json_extract(e.properties, '$.duration_ms') AS INTEGER)
              END
            ) AS duration_ms
          FROM sessions s
          JOIN analytics_events e ON e.session_id = s.session_id
          GROUP BY s.session_id
        )
        SELECT
          COUNT(*) AS total,
          SUM(
            CASE
              WHEN page_views = 1 AND (duration_ms IS NULL OR duration_ms < 10000)
              THEN 1
              ELSE 0
            END
          ) AS bounces
        FROM session_stats
      `,
      args: [from],
    },
    {
      sql: `
        SELECT COUNT(DISTINCT session_id) AS count
        FROM analytics_events
        WHERE event_name = 'scroll_depth'
          AND created_at >= ?
          AND CAST(json_extract(properties, '$.depth') AS INTEGER) = 25
      `,
      args: [from],
    },
    {
      sql: `
        SELECT COUNT(DISTINCT session_id) AS count
        FROM analytics_events
        WHERE event_name = 'scroll_depth'
          AND created_at >= ?
          AND CAST(json_extract(properties, '$.depth') AS INTEGER) = 50
      `,
      args: [from],
    },
    {
      sql: `
        SELECT COUNT(DISTINCT session_id) AS count
        FROM analytics_events
        WHERE event_name = 'scroll_depth'
          AND created_at >= ?
          AND CAST(json_extract(properties, '$.depth') AS INTEGER) = 75
      `,
      args: [from],
    },
    {
      sql: `
        SELECT COUNT(DISTINCT session_id) AS count
        FROM analytics_events
        WHERE event_name = 'scroll_depth'
          AND created_at >= ?
          AND CAST(json_extract(properties, '$.depth') AS INTEGER) = 100
      `,
      args: [from],
    },
    {
      sql: `
        SELECT
          COALESCE(json_extract(properties, '$.cta_location'), 'unknown') AS location,
          COUNT(*) AS clicks
        FROM analytics_events
        WHERE event_name = 'book_demo_click' AND created_at >= ?
        GROUP BY location
        ORDER BY clicks DESC
      `,
      args: [from],
    },
    {
      sql: `
        SELECT date(created_at) AS date, COUNT(*) AS count
        FROM demo_signups
        WHERE created_at >= ?
        GROUP BY date(created_at)
        ORDER BY date(created_at)
      `,
      args: [from],
    },
    {
      sql: `
        SELECT date(created_at) AS date, COUNT(DISTINCT session_id) AS count
        FROM analytics_events
        WHERE event_name = 'page_view' AND created_at >= ?
        GROUP BY date(created_at)
        ORDER BY date(created_at)
      `,
      args: [from],
    },
  ]);

  const uniqueVisitors = toNumber(visitorsResult.rows[0]?.count);
  const totalSessions = toNumber(sessionsResult.rows[0]?.count);
  const bookDemoClicks = toNumber(clickSessionsResult.rows[0]?.count);
  const uniqueClickers = toNumber(clickVisitorsResult.rows[0]?.count);
  const demoSignups = toNumber(signupsResult.rows[0]?.count);
  const avgTimeOnPageMs = toNumber(avgDurationResult.rows[0]?.avg_ms);

  const bounceTotal = toNumber(bounceResult.rows[0]?.total);
  const bounces = toNumber(bounceResult.rows[0]?.bounces);
  const bounceRate =
    bounceTotal > 0 ? Math.round((bounces / bounceTotal) * 1000) / 10 : 0;

  const scrollPct = (count: number) =>
    totalSessions > 0 ? Math.round((count / totalSessions) * 1000) / 10 : 0;

  const signupRate =
    totalSessions > 0
      ? Math.round((demoSignups / totalSessions) * 1000) / 10
      : 0;
  const clickRate =
    uniqueVisitors > 0
      ? Math.round((uniqueClickers / uniqueVisitors) * 1000) / 10
      : 0;

  return {
    uniqueVisitors,
    totalSessions,
    bookDemoClicks,
    uniqueClickers,
    demoSignups,
    signupRate,
    clickRate,
    avgTimeOnPageMs,
    bounceRate,
    scrollDepth: {
      p25: scrollPct(toNumber(scroll25.rows[0]?.count)),
      p50: scrollPct(toNumber(scroll50.rows[0]?.count)),
      p75: scrollPct(toNumber(scroll75.rows[0]?.count)),
      p100: scrollPct(toNumber(scroll100.rows[0]?.count)),
    },
    ctaBreakdown: ctaResult.rows.map((row) => ({
      location: String(row.location ?? "unknown"),
      clicks: toNumber(row.clicks),
    })),
    signupsOverTime: signupsOverTimeResult.rows.map((row) => ({
      date: String(row.date),
      count: toNumber(row.count),
    })),
    sessionsOverTime: sessionsOverTimeResult.rows.map((row) => ({
      date: String(row.date),
      count: toNumber(row.count),
    })),
  };
}

export async function getRecentSignups(limit = 20): Promise<RecentSignup[]> {
  const db = await getDb();

  const result = await db.execute({
    sql: `
      SELECT studio_name, email, created_at
      FROM demo_signups
      ORDER BY created_at DESC
      LIMIT ?
    `,
    args: [limit],
  });

  return result.rows.map((row) => ({
    studioName: String(row.studio_name),
    email: String(row.email),
    createdAt: String(row.created_at),
  }));
}
