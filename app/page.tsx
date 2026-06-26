const marqueeItems = [
  "Reformer",
  "Mat Pilates",
  "Vinyasa",
  "Hot Yoga",
  "Barre",
  "Sculpt",
  "Strength",
  "HIIT",
  "Spin",
  "Boxing",
];

const integrations = [
  { name: "Mindbody", color: "#6c5ce7" },
  { name: "Arketa", color: "#00b894" },
  { name: "ClassPass", color: "#e84393" },
  { name: "WhatsApp", color: "#25d366" },
  { name: "Instagram", color: "#e1306c" },
  { name: "Google", color: "#ea4335" },
];

export default function Home() {
  return (
    <>
      <div className="announce">
        <a href="#">
          <span className="pill">NEW</span>
          Pulse is now onboarding its first cohort of London Pilates studios
          <span className="arrow">→</span>
        </a>
      </div>

      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#" className="logo">
            <span className="dot" />
            Pulse
          </a>
          <nav className="nav-links">
            <div className="item">
              Product <span className="caret">▾</span>
              <div className="dd">
                <div className="dd-group">
                  <div className="dd-label">Retain</div>
                  <a href="#">
                    <b>Churn Shield</b>
                    <span>Catch at-risk members before they go quiet</span>
                  </a>
                  <a href="#">
                    <b>ClassPass Converter</b>
                    <span>Turn drop-in visitors into members</span>
                  </a>
                  <a href="#">
                    <b>Renewal Manager</b>
                    <span>Save renewals before the card charges</span>
                  </a>
                </div>
                <div className="dd-group">
                  <div className="dd-label">Fill</div>
                  <a href="#">
                    <b>Capacity Optimiser</b>
                    <span>Fill under-booked classes automatically</span>
                  </a>
                  <a href="#">
                    <b>Waitlist Automator</b>
                    <span>Backfill every cancellation, hands-free</span>
                  </a>
                </div>
                <div className="dd-group">
                  <div className="dd-label">Know</div>
                  <a href="#">
                    <b>Pre-Class Member Brief</b>
                    <span>Every instructor walks in informed</span>
                  </a>
                  <a href="#">
                    <b>Weekly Business Digest</b>
                    <span>MRR, churn and fill rates every Sunday</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="item">
              Industries <span className="caret">▾</span>
              <div className="dd">
                <div className="dd-group">
                  <a href="#">
                    <b>Pilates &amp; Reformer</b>
                    <span>46% of new studio openings</span>
                  </a>
                  <a href="#">
                    <b>Yoga &amp; Hot Yoga</b>
                    <span>High-frequency, high-retention</span>
                  </a>
                  <a href="#">
                    <b>Barre &amp; Sculpt</b>
                    <span>Boutique formats, loyal members</span>
                  </a>
                  <a href="#">
                    <b>Strength &amp; HIIT</b>
                    <span>Capacity-led, class-pack driven</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="item">How it works</div>
            <div className="item">Pricing</div>
          </nav>
          <div className="nav-spacer" />
          <div className="nav-cta">
            <a href="#" className="login">
              Log in
            </a>
            <a href="#book" className="btn btn-primary">
              Book a Demo
            </a>
          </div>
          <div className="burger">
            <span />
            <span />
            <span />
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <div className="eyebrow">The AI operating layer for studios</div>
          <h1>
            Your studio runs itself <em>while you teach</em>
          </h1>
          <p className="sub">
            Pulse is an always-on agent that retains every member, fills every class, and answers every enquiry — working through WhatsApp, on top of the software you already use. You get your week back.
          </p>
          <div className="cta-row">
            <a href="#book" className="btn btn-primary">
              Book a Demo
            </a>
            <a href="#how" className="btn btn-ghost">
              See how it works
            </a>
          </div>

          <div className="collage">
            <div className="tile t-reformer">
              <span>Reformer Pilates</span>
            </div>
            <div className="phone-float">
              <div className="wa-thread">
                <div className="wa-head">
                  <div className="av">P</div> Pulse · today
                </div>
                <div className="bub in">
                  Sarah hasn&apos;t booked in 3 weeks — unusual for her. Want me to check in?
                </div>
                <div className="bub out">Yes, go ahead 👍</div>
                <div className="bub in">
                  Done. Sent from your name, mentioned her last reformer class with Jess. I&apos;ll follow up if no reply in 48h.
                </div>
              </div>
            </div>
            <div className="tile t-yoga">
              <span>Yoga</span>
            </div>
            <div className="tile t-barre">
              <span>Barre</span>
            </div>
            <div className="tile t-hot">
              <span>Hot Yoga</span>
            </div>
            <div className="tile t-spin">
              <span>Strength</span>
            </div>
          </div>

          <div className="trust">
            <div className="badge">
              <div className="ic">🇬🇧</div>
              <div>
                <b>UK-first</b>
                <br />
                <small>Built for London studios</small>
              </div>
            </div>
            <div className="badge">
              <div className="ic">🔒</div>
              <div>
                <b>GDPR-ready</b>
                <br />
                <small>Member data handled with care</small>
              </div>
            </div>
            <div className="badge">
              <div className="ic">💬</div>
              <div>
                <b>WhatsApp-native</b>
                <br />
                <small>No new app to learn</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <a key={`${item}-${index}`} href="#">
              {item}
            </a>
          ))}
        </div>
      </div>

      <section className="integ">
        <div className="wrap">
          <p className="lead">
            Pulse sits on top of the tools your studio already runs on — no migration, no rip-and-replace.
          </p>
          <div className="integ-grid">
            {integrations.map((item) => (
              <div key={item.name} className="chip">
                <span className="d" style={{ background: item.color }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pillars" id="how">
        <div className="wrap">
          <div className="head">
            <div className="eyebrow">What Pulse does</div>
            <h2>Your studio scales on your terms</h2>
            <p>
              Retention protects revenue. Filling classes saves money left on the table. Intelligence makes both visible. Pulse runs all three, every day, while you teach.
            </p>
          </div>

          <div className="pillar-grid">
            <div className="pcard">
              <div className="tag">Retain</div>
              <h3>Churn Shield</h3>
              <div className="desc">
                Scores every member daily on attendance and booking patterns. When someone goes quiet, Pulse sends a personal WhatsApp from your name — referencing their last class and instructor.
              </div>
              <div className="demo">
                <div className="row">
                  <span className="t">
                    <span className="clock">Day 21</span> Attendance gap detected
                  </span>
                  <span className="status hot">At risk</span>
                </div>
                <div className="row">
                  <span className="t">
                    <span className="clock">Day 21</span> Personal check-in sent
                  </span>
                  <span className="status">Sent</span>
                </div>
                <div className="row">
                  <span className="t">
                    <span className="clock">Day 22</span> Member re-booked
                  </span>
                  <span className="status ok">Retained</span>
                </div>
              </div>
              <div className="bigstat">
                <span className="n">1</span>
                <span className="l">retained member a month pays for Pulse</span>
              </div>
              <a href="#" className="more">
                Learn more →
              </a>
            </div>

            <div className="pcard">
              <div className="tag">Fill</div>
              <h3>Capacity Optimiser</h3>
              <div className="desc">
                Watches fill rates in real time. When a class dips below your threshold with 48 hours to go, Pulse runs a targeted push to the members most likely to book — and stops the moment it&apos;s full.
              </div>
              <div className="demo">
                <div className="wa-thread">
                  <div className="wa-head">
                    <div className="av">P</div> 9am Reformer · Thursday
                  </div>
                  <div className="bub in">Only 4 of 10 booked. Pushing to 12 lapsed reformer regulars now.</div>
                  <div className="bub in">Filled to 10/10. Push stopped 🎉</div>
                </div>
              </div>
              <div className="bigstat">
                <span className="n">60%</span>
                <span className="l">fill threshold, fully configurable</span>
              </div>
              <a href="#" className="more">
                Learn more →
              </a>
            </div>

            <div className="pcard">
              <div className="tag">Know</div>
              <h3>Pre-Class Member Brief</h3>
              <div className="desc">
                Before every class, each instructor gets a WhatsApp brief on who&apos;s booked in — tenure, injuries, notes from past instructors, and a churn flag. The knowledge stays even when staff move on.
              </div>
              <div className="demo">
                <div className="wa-thread">
                  <div className="wa-head">
                    <div className="av">P</div> Your 9am · 6 booked
                  </div>
                  <div className="bub in">
                    <b>Sarah Chen</b> — 47 classes, 14 mo. Last in 3 weeks ago. Lower-back sensitivity noted. Worth a check-in.
                  </div>
                  <div className="bub in">
                    <b>Amanda Wu</b> — 3 classes, all ClassPass. High conversion potential.
                  </div>
                </div>
              </div>
              <div className="bigstat">
                <span className="n">0</span>
                <span className="l">apps for instructors to learn</span>
              </div>
              <a href="#" className="more">
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="story">
        <div className="wrap">
          <div className="story-card">
            <div className="copy">
              <span className="illus-tag">Illustrative · a week with Pulse</span>
              <h2>London Reformer Co.</h2>
              <div className="meta">Single-site Pilates studio · Islington · 320 active members</div>
              <p>
                A typical independent studio loses roughly 10–15 hours a week to admin that doesn&apos;t need the owner present, and sees a third of enquiries go unanswered. Here&apos;s what that same week looks like once Pulse is running on top of their Mindbody account.
              </p>
              <p>
                Churn Shield catches the quiet members. The Capacity Optimiser fills the mid-week reformer slots that used to run half-empty. Instructors walk into every class already briefed. The owner spends Sunday reading a two-minute digest instead of three spreadsheets.
              </p>
              <div className="story-stats">
                <div className="s">
                  <div className="n">10–15h</div>
                  <div className="l">owner admin recovered each week</div>
                </div>
                <div className="s">
                  <div className="n">35%</div>
                  <div className="l">unanswered enquiries, now handled 24/7</div>
                </div>
                <div className="s">
                  <div className="n">&lt;60s</div>
                  <div className="l">response time on every channel</div>
                </div>
              </div>
            </div>
            <div className="story-visual">
              <div className="week-card">
                <div className="week-head">
                  <b>This week, handled by Pulse</b>
                  <span>auto</span>
                </div>
                <div className="week-body">
                  <div className="week-item">
                    <span className="dot2" style={{ background: "var(--terracotta)" }} />
                    <span className="txt">
                      9 at-risk members re-engaged
                      <small>3 re-booked within 48 hours</small>
                    </span>
                  </div>
                  <div className="week-item">
                    <span className="dot2" style={{ background: "var(--sage)" }} />
                    <span className="txt">
                      4 under-filled classes topped up
                      <small>Tue 7am, Wed 12pm, Thu 9am, Fri 6pm</small>
                    </span>
                  </div>
                  <div className="week-item">
                    <span className="dot2" style={{ background: "var(--gold)" }} />
                    <span className="txt">
                      12 instructor briefs delivered
                      <small>Every class, 30 min before</small>
                    </span>
                  </div>
                  <div className="week-item">
                    <span className="dot2" style={{ background: "#6c5ce7" }} />
                    <span className="txt">
                      28 enquiries answered
                      <small>WhatsApp, Instagram &amp; web chat</small>
                    </span>
                  </div>
                  <div className="week-item">
                    <span className="dot2" style={{ background: "var(--wa)" }} />
                    <span className="txt">
                      2 failed payments recovered
                      <small>No awkward owner conversation</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="quotes">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="eyebrow">From the people who run studios</div>
              <h2>Built around the studio owner&apos;s week</h2>
            </div>
            <small>Sample voices — illustrative of the operator Pulse is built for, not live customers.</small>
          </div>
          <div className="qgrid">
            <div className="qcard">
              <div className="mark">&quot;</div>
              <p>
                The bit I never have time for is the quiet members. By the time I notice someone&apos;s gone, they&apos;ve already cancelled. Something that catches that for me is the whole game.
              </p>
              <div className="who">
                <div className="av" style={{ background: "var(--terracotta)" }}>
                  SO
                </div>
                <div>
                  <b>Studio owner</b>
                  <span>Reformer Pilates · North London</span>
                </div>
              </div>
            </div>
            <div className="qcard">
              <div className="mark">&quot;</div>
              <p>
                My instructors are brilliant in the room but everything they know about a member lives in their head. When one leaves, it&apos;s gone. A brief before every class would change how the floor runs.
              </p>
              <div className="who">
                <div className="av" style={{ background: "var(--sage)" }}>
                  SM
                </div>
                <div>
                  <b>Studio manager</b>
                  <span>Yoga &amp; Barre · South East London</span>
                </div>
              </div>
            </div>
            <div className="qcard">
              <div className="mark">&quot;</div>
              <p>
                ClassPass sends people through the door and then I just… lose them. Closing that loop without me chasing every visitor is worth real money each month.
              </p>
              <div className="who">
                <div className="av" style={{ background: "var(--gold)" }}>
                  FO
                </div>
                <div>
                  <b>Founder</b>
                  <span>Boutique Pilates · Zone 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="security">
        <div className="wrap">
          <div className="head">
            <div className="eyebrow">Under the hood</div>
            <h2>Member trust, handled with care</h2>
            <p>
              Member notes and health conditions are sensitive. Pulse is built to treat them the way a good studio already does — with consent, control, and care.
            </p>
          </div>
          <div className="sec-grid">
            <div className="seccard">
              <div className="ic">🇪🇺</div>
              <h3>GDPR by design</h3>
              <p>
                Consent is explicit and built into onboarding. Members own their data, and the same notes any good studio keeps simply get a permanent, secure home.
              </p>
            </div>
            <div className="seccard">
              <div className="ic">🎚️</div>
              <h3>You set the autonomy</h3>
              <p>
                Every feature runs in full-auto, draft-for-approval, or notify-only mode. Hand over the routine, keep control of the sensitive — owner&apos;s choice, per feature.
              </p>
            </div>
            <div className="seccard">
              <div className="ic">🔌</div>
              <h3>Layer, don&apos;t replace</h3>
              <p>
                Pulse reads and acts on top of Mindbody and Arketa. Nothing to migrate, no risk to your existing schedule, booking, or billing.
              </p>
            </div>
          </div>
          <div className="sec-badges">
            <div className="b">🔒 Encrypted in transit &amp; at rest</div>
            <div className="b">🇬🇧 UK &amp; EU data handling</div>
            <div className="b">✅ Meta-approved WhatsApp Business API</div>
          </div>
        </div>
      </section>

      <section className="final" id="book">
        <div className="wrap">
          <div className="eyebrow">Every member remembered. Every class full.</div>
          <h2>Give your studio its week back</h2>
          <p>
            See what Pulse would do for your studio in a 20-minute walkthrough — built by someone who&apos;s run and exited a studio, for owners who still do.
          </p>
          <div className="cta-row">
            <a href="#" className="btn btn-primary">
              Book a Demo
            </a>
            <a href="#" className="btn btn-dark">
              Talk to Pulse on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <a href="#" className="logo">
                <span className="dot" />
                Pulse
              </a>
              <p>The AI operating layer for independent fitness studios.</p>
              <a href="#" className="mail">
                hello@pulsestudio.ai
              </a>
            </div>
            <div className="fcol">
              <h4>Product</h4>
              <a href="#">Churn Shield</a>
              <a href="#">Capacity Optimiser</a>
              <a href="#">ClassPass Converter</a>
              <a href="#">Member Brief</a>
              <a href="#">Weekly Digest</a>
            </div>
            <div className="fcol">
              <h4>Studios</h4>
              <a href="#">Pilates &amp; Reformer</a>
              <a href="#">Yoga &amp; Hot Yoga</a>
              <a href="#">Barre &amp; Sculpt</a>
              <a href="#">Strength &amp; HIIT</a>
              <a href="#">Pricing</a>
            </div>
            <div className="fcol">
              <h4>Company</h4>
              <a href="#">How it works</a>
              <a href="#">Book a Demo</a>
              <a href="#">For partners</a>
              <a href="#">Privacy</a>
            </div>
          </div>
          <div className="foot-bot">
            <span className="c">© 2026 Pulse · Made in London</span>
            <div className="soc">
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
              <a href="#">X</a>
            </div>
          </div>
        </div>
        <div className="disclaimer">
          Concept mockup. Pulse is a pre-launch product brief; studio names, quotes, statistics and the case study shown are illustrative and do not represent live customers. Layout pattern adapted from a home-services AI reference site.
        </div>
      </footer>
    </>
  );
}
