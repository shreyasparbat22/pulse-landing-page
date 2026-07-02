import type { CSSProperties } from "react";

import { BookDemoButton } from "@/components/book-demo";
import { PageTracker } from "@/components/page-tracker";

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
      <PageTracker />
      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#" className="logo">
            <span className="dot" />
            Sam
          </a>
          <div className="nav-spacer" />
          <div className="nav-cta">
            <BookDemoButton className="btn btn-primary" location="nav" />
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <div className="eyebrow">Meet Sam, the AI operating layer for studios</div>
          <h1>
            Your fitness studio runs itself <em>while you teach</em>
          </h1>
          <p className="sub">
            Sam is the always-on AI studio owners get to run the business behind the business — retaining every member, filling every class, and answering every enquiry through WhatsApp, on top of the software you already use. You get your week back.
          </p>
          <div className="cta-row">
            <BookDemoButton className="btn btn-primary" location="hero" />
          </div>

          <div className="surfaces">
            <div className="surface-grid">
              <figure className="surface" style={{ "--accent": "var(--terracotta)" } as CSSProperties}>
                <div className="surface-copy">
                  <span className="surface-tag">Owner app</span>
                  <p className="surface-title">Your morning brief, already triaged</p>
                </div>
                <div className="device">
                  <img
                    src="/screens/dashboard.png"
                    alt="Sam's morning brief showing the day's classes, fill rate, revenue due and the members who need a personal touch"
                    loading="lazy"
                  />
                </div>
              </figure>

              <figure className="surface" style={{ "--accent": "var(--gold)" } as CSSProperties}>
                <div className="surface-copy">
                  <span className="surface-tag">Phone call</span>
                  <p className="surface-title">Sam answers, and checks before it charges</p>
                </div>
                <div className="device">
                  <img
                    src="/screens/call-approval.png"
                    alt="Sam handling a phone call to cancel a class and asking the owner to approve charging the late-cancellation fee"
                    loading="lazy"
                  />
                </div>
              </figure>

              <figure className="surface" style={{ "--accent": "var(--sage)" } as CSSProperties}>
                <div className="surface-copy">
                  <span className="surface-tag">Instagram DM</span>
                  <p className="surface-title">Every message answered in seconds</p>
                </div>
                <div className="device">
                  <img
                    src="/screens/instagram-dm.png"
                    alt="Sam answering an Instagram DM about a full HIIT class, adding the member to the waitlist and confirming their spot"
                    loading="lazy"
                  />
                </div>
              </figure>
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
            Sam sits on top of the tools your studio already runs on — no migration, no rip-and-replace.
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
            <div className="eyebrow">What Sam does</div>
            <h2>Your studio scales on your terms</h2>
            <p>
              Retention protects revenue. Filling classes saves money left on the table. Intelligence makes both visible. Sam runs all three, every day, while you teach.
            </p>
          </div>

          <div className="pillar-grid">
            <div className="pcard">
              <div className="tag">Retain</div>
              <h3>Churn Shield</h3>
              <div className="desc">
                Scores every member daily on attendance and booking patterns. When someone goes quiet, Sam sends a personal WhatsApp from your name — referencing their last class and instructor.
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
                <span className="l">retained member a month pays for Sam</span>
              </div>
            </div>

            <div className="pcard">
              <div className="tag">Fill</div>
              <h3>Capacity Optimiser</h3>
              <div className="desc">
                Watches fill rates in real time. When a class dips below your threshold with 48 hours to go, Sam runs a targeted push to the members most likely to book — and stops the moment it&apos;s full.
              </div>
              <div className="demo">
                <div className="wa-thread">
                  <div className="wa-head">
                    <div className="av">S</div> 9am Reformer · Thursday
                  </div>
                  <div className="bub in">Only 4 of 10 booked. Pushing to 12 lapsed reformer regulars now.</div>
                  <div className="bub in">Filled to 10/10. Push stopped 🎉</div>
                </div>
              </div>
              <div className="bigstat">
                <span className="n">60%</span>
                <span className="l">fill threshold, fully configurable</span>
              </div>
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
                    <div className="av">S</div> Your 9am · 6 booked
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
              Member notes and health conditions are sensitive. Sam is built to treat them the way a good studio already does — with consent, control, and care.
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
                Sam reads and acts on top of Mindbody and Arketa. Nothing to migrate, no risk to your existing schedule, booking, or billing.
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
          <h2>Get 10+ hours back every week</h2>
          <p>
            See what Sam would do for your studio in a 20-minute walkthrough — built by someone who&apos;s run and exited a studio, for owners who still do.
          </p>
          <div className="cta-row">
            <BookDemoButton className="btn btn-primary" location="final" />
          </div>
        </div>
      </section>

      <footer>
        <div className="foot-wordmark">SAM</div>
      </footer>
    </>
  );
}
