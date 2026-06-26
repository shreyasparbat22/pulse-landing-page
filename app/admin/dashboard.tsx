import Link from "next/link";
import {
  getAnalyticsMetrics,
  getRecentSignups,
  type AnalyticsMetrics,
  type RecentSignup,
} from "@/lib/db";

function formatDuration(ms: number): string {
  if (ms <= 0) return "—";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function formatCompactNumber(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return `${value}`;
}

function buildLinePath(values: number[], width: number, height: number): string {
  if (values.length === 0) return "";
  const maxValue = Math.max(...values, 1);

  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - (value / maxValue) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export async function AdminDashboard() {
  let metrics: AnalyticsMetrics | null = null;
  let recentSignups: RecentSignup[] = [];
  let error: string | null = null;

  try {
    [metrics, recentSignups] = await Promise.all([
      getAnalyticsMetrics(),
      getRecentSignups(),
    ]);
  } catch {
    error = "Could not load analytics. Check Turso configuration.";
  }

  return (
    <div className="admin">
      <div className="wrap admin-inner">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">Internal</p>
            <h1>Pulse Analytics</h1>
          </div>
          <div className="admin-header-meta">
            <span>Last 30 days</span>
            <Link href="/" className="btn btn-ghost">
              Back to site
            </Link>
          </div>
        </header>

        {error ? (
          <div className="admin-error">{error}</div>
        ) : metrics ? (
          <>
            <div className="admin-grid">
              <div className="admin-card">
                <p className="admin-label">Unique visitors</p>
                <p className="admin-value">{metrics.uniqueVisitors.toLocaleString()}</p>
              </div>
              <div className="admin-card">
                <p className="admin-label">Sessions</p>
                <p className="admin-value">{metrics.totalSessions.toLocaleString()}</p>
              </div>
              <div className="admin-card">
                <p className="admin-label">Bounce rate</p>
                <p className="admin-value">{metrics.bounceRate}%</p>
              </div>
              <div className="admin-card">
                <p className="admin-label">Book Demo clicks</p>
                <p className="admin-value">{metrics.bookDemoClicks.toLocaleString()}</p>
                <p className="admin-sub">
                  {metrics.uniqueClickers} unique visitors ({metrics.clickRate}%)
                </p>
              </div>
              <div className="admin-card">
                <p className="admin-label">Demo signups</p>
                <p className="admin-value">{metrics.demoSignups.toLocaleString()}</p>
                <p className="admin-sub">{metrics.signupRate}% of sessions</p>
              </div>
              <div className="admin-card">
                <p className="admin-label">Avg time on page</p>
                <p className="admin-value">{formatDuration(metrics.avgTimeOnPageMs)}</p>
              </div>
            </div>

            <section className="admin-section">
              <h2>Traffic & signups trend</h2>
              <p className="admin-section-sub">Daily sessions vs demo signups over the last 30 days</p>
              {metrics.sessionsOverTime.length === 0 && metrics.signupsOverTime.length === 0 ? (
                <p className="admin-empty">No trend data yet.</p>
              ) : (
                <div className="admin-line-chart-wrap">
                  <svg viewBox="0 0 100 40" className="admin-line-chart" role="img" aria-label="Sessions and signups trend">
                    <path
                      d={buildLinePath(
                        metrics.sessionsOverTime.map((item) => item.count),
                        100,
                        40,
                      )}
                      className="admin-line admin-line-sessions"
                    />
                    <path
                      d={buildLinePath(
                        metrics.signupsOverTime.map((item) => item.count),
                        100,
                        40,
                      )}
                      className="admin-line admin-line-signups"
                    />
                  </svg>
                  <div className="admin-line-legend">
                    <span className="admin-legend-item">
                      <span className="admin-legend-dot admin-legend-dot-sessions" />
                      Sessions
                    </span>
                    <span className="admin-legend-item">
                      <span className="admin-legend-dot admin-legend-dot-signups" />
                      Signups
                    </span>
                  </div>
                </div>
              )}
            </section>

            <section className="admin-section">
              <h2>Conversion funnel</h2>
              <p className="admin-section-sub">How visitors move from landing to signup</p>
              <div className="admin-funnel">
                {[
                  { label: "Visitors", value: metrics.uniqueVisitors, pct: 100 },
                  {
                    label: "Book Demo clickers",
                    value: metrics.uniqueClickers,
                    pct:
                      metrics.uniqueVisitors > 0
                        ? Math.round((metrics.uniqueClickers / metrics.uniqueVisitors) * 1000) / 10
                        : 0,
                  },
                  {
                    label: "Demo signups",
                    value: metrics.demoSignups,
                    pct:
                      metrics.uniqueVisitors > 0
                        ? Math.round((metrics.demoSignups / metrics.uniqueVisitors) * 1000) / 10
                        : 0,
                  },
                ].map((step) => (
                  <div key={step.label} className="admin-funnel-row">
                    <div className="admin-funnel-labels">
                      <span>{step.label}</span>
                      <span>{formatCompactNumber(step.value)} ({step.pct}%)</span>
                    </div>
                    <div className="admin-funnel-track">
                      <div
                        className="admin-funnel-fill"
                        style={{ width: `${Math.min(step.pct, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-section">
              <h2>Scroll depth</h2>
              <p className="admin-section-sub">
                Share of sessions reaching each milestone
              </p>
              <div className="admin-scroll-bars">
                {(
                  [
                    ["25%", metrics.scrollDepth.p25],
                    ["50%", metrics.scrollDepth.p50],
                    ["75%", metrics.scrollDepth.p75],
                    ["100%", metrics.scrollDepth.p100],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="admin-scroll-row">
                    <span className="admin-scroll-label">{label}</span>
                    <div className="admin-scroll-track">
                      <div
                        className="admin-scroll-fill"
                        style={{ width: `${Math.min(value, 100)}%` }}
                      />
                    </div>
                    <span className="admin-scroll-pct">{value}%</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-section">
              <h2>CTA breakdown</h2>
              {metrics.ctaBreakdown.length === 0 ? (
                <p className="admin-empty">No Book Demo clicks yet.</p>
              ) : (
                <div className="admin-cta-grid">
                  {metrics.ctaBreakdown.map((item) => (
                    <div key={item.location} className="admin-cta-item">
                      <div className="admin-cta-head">
                        <span className="admin-cta-location">{item.location}</span>
                        <span className="admin-cta-count">{item.clicks}</span>
                      </div>
                      <div className="admin-cta-track">
                        <div
                          className="admin-cta-fill"
                          style={{
                            width: `${
                              Math.min(
                                (item.clicks /
                                  Math.max(...metrics.ctaBreakdown.map((value) => value.clicks), 1)) *
                                  100,
                                100,
                              )
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="admin-two-col">
              <section className="admin-section">
                <h2>Sessions over time</h2>
                {metrics.sessionsOverTime.length === 0 ? (
                  <p className="admin-empty">No session data yet.</p>
                ) : (
                  <ul className="admin-timeline">
                    {metrics.sessionsOverTime.map((item) => (
                      <li key={item.date}>
                        <span>{formatShortDate(item.date)}</span>
                        <span>{item.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="admin-section">
                <h2>Signups over time</h2>
                {metrics.signupsOverTime.length === 0 ? (
                  <p className="admin-empty">No signups yet.</p>
                ) : (
                  <ul className="admin-timeline">
                    {metrics.signupsOverTime.map((item) => (
                      <li key={item.date}>
                        <span>{formatShortDate(item.date)}</span>
                        <span>{item.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <section className="admin-section">
              <h2>Recent signups</h2>
              {recentSignups.length === 0 ? (
                <p className="admin-empty">No demo signups yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Studio</th>
                        <th>Email</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSignups.map((signup) => (
                        <tr key={`${signup.email}-${signup.createdAt}`}>
                          <td>{signup.studioName}</td>
                          <td>{signup.email}</td>
                          <td>{formatDate(signup.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
