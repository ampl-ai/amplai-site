/* Sections: Services, Process, Pillars, Quote, About, Contact, sub-page heroes
   Exposes: ServicesGrid, ProcessList, PillarsGrid, QuoteSection, AboutBlock, PrinciplesGrid, ContactBlock, SubHero
*/

/* Tiny inline icons — 1.5 stroke, 24px grid */
const I = {
  workflow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <rect x="3" y="3" width="6" height="6" rx="1"/>
      <rect x="15" y="3" width="6" height="6" rx="1"/>
      <rect x="9" y="15" width="6" height="6" rx="1"/>
      <path d="M6 9v3a2 2 0 0 0 2 2h4M18 9v3a2 2 0 0 1-2 2h-4"/>
    </svg>
  ),
  pipeline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/>
      <circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/>
      <path d="M7 6h10M7 18h10M5 8v8M19 8v8"/>
    </svg>
  ),
  bot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <rect x="4" y="7" width="16" height="12" rx="2"/>
      <path d="M12 7V4M9 12h.01M15 12h.01"/>
      <path d="M9 16c1 .8 2 1 3 1s2-.2 3-1"/>
      <path d="M2 12h2M20 12h2"/>
    </svg>
  ),
  cap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M2 9l10-5 10 5-10 5L2 9z"/>
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>
      <path d="M22 9v5"/>
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M9 7H7a5 5 0 0 0 0 10h2"/>
      <path d="M15 7h2a5 5 0 0 1 0 10h-2"/>
      <path d="M8 12h8"/>
    </svg>
  ),
  arr: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
};

function ServicesGrid({ setPage }) {
  const items = [
    {
      n: '01',
      icon: I.workflow,
      t: 'AI workflow consulting',
      p: 'We map your operations, identify where AI saves time and money, and deliver a prioritised implementation roadmap with real ROI projections.',
      bullets: ['Workflow audit & opportunity matrix', 'Tool recommendations with cost-benefit', 'Implementation roadmap', 'Custom build estimates'],
    },
    {
      n: '02',
      icon: I.pipeline,
      t: 'AI-powered lead generation',
      p: 'Automated pipelines that find, qualify, and contact ideal prospects on autopilot — turning AI into your most productive sales team member.',
      bullets: ['Automated prospect sourcing & enrichment', 'AI-personalised outreach sequences', 'Performance dashboards', 'Ongoing optimisation'],
    },
    {
      n: '03',
      icon: I.bot,
      t: 'Custom AI chatbots & automation',
      p: 'Intelligent chatbots that integrate with your systems and perform real actions — not just answer questions. HR, support, sales, and beyond.',
      bullets: ['System integrations (HR, CRM, ERP)', 'Role-based access & data segregation', 'Knowledge base ingestion', 'Ongoing maintenance & updates'],
    },
    {
      n: '04',
      icon: I.link,
      t: 'AI automation & system integration',
      p: 'We connect your tools, eliminate manual data transfer, and add AI decision-making at every step. Multi-step workflows that run themselves — beyond simple Zapier connections.',
      bullets: ['CRM ↔ finance ↔ HR sync', 'Document & invoice extraction', 'AI-routed approval workflows', 'Real-time dashboards with anomaly detection'],
    },
    {
      n: '05',
      icon: I.cap,
      t: 'AI training & workshops',
      p: 'Empower your team to use AI effectively, safely, and confidently in their daily work. From half-day foundations to department-specific deep dives, run on your team\u2019s real workflows.',
      bullets: ['AI Foundations (half day, all staff)', 'Leaders & decision makers', 'Department deep dives (sales, HR, finance)', 'Prompt engineering masterclass'],
    },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div><div className="eyebrow">What we do</div></div>
          <div>
            <h2 className="serif">Five ways we amplify your business.</h2>
            <p className="lede">Strategy, leads, automation, integration, and training — we deliver measurable results from day one. Engagements scope from half-day workshops to twelve-month partnerships.</p>
          </div>
        </div>
        <div className="services-grid">
          {items.map((it, i) => (
            <div className={'service reveal reveal-' + (i + 1)} key={it.n} onClick={() => setPage && setPage('Services')}>
              <div className="num">— {it.n}</div>
              <div className="icon">{it.icon}</div>
              <h3>{it.t}</h3>
              <p>{it.p}</p>
              <ul>{it.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
              <span className="more">Read more <span className="arr">→</span></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessList() {
  const steps = [
    { n: '01', when: 'Day 1',     t: 'Discovery call',  p: 'A 30-minute conversation to understand your workflows, pain points, and goals. No commitment, no pitch — we listen first and qualify second.' },
    { n: '02', when: 'Week 1',    t: 'AI audit & roadmap', p: 'We map your processes, identify the highest-impact AI opportunities, and deliver a written plan with clear ROI projections, build estimates, and risks.' },
    { n: '03', when: 'Week 2–6',  t: 'Build & deploy',  p: 'We implement the solutions — from workflow automations to custom chatbots — with your team involved at every checkpoint. No black-box handoff.' },
    { n: '04', when: 'Ongoing',   t: 'Optimise & scale', p: 'We monitor performance, refine the systems, and expand what is working. Most clients see measurable results within 90 days of go-live.' },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div><div className="eyebrow">How it works</div></div>
          <div>
            <h2 className="serif">From first call to measurable results.</h2>
            <p className="lede">A four-stage engagement designed for mid-market velocity. Most engagements move from discovery to deployed solution inside six weeks.</p>
          </div>
        </div>
        <div className="process-list">
          {steps.map((s, i) => (
            <div key={i} className={'process-row reveal reveal-' + ((i % 3) + 1)}>
              <div className="step">— {s.n}</div>
              <div className="when">{s.when}</div>
              <div>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </div>
              <div className="glyph">{I.arr}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarsGrid() {
  const items = [
    { n: '01', t: 'We practise what we sell.', p: 'Our own business runs on AI. Every proposal, report, and outreach campaign is AI-assisted. We are not theorists — we are practitioners using the tools we deploy for clients.' },
    { n: '02', t: 'Results in weeks, not quarters.', p: 'Traditional consultancies deliver a PowerPoint in three months. We aim to deliver working solutions in weeks — discovery to first deployed automation, scoped tightly and shipped in production.' },
    { n: '03', t: 'Built for the mid-market.', p: 'Enterprise consultancies charge €300/hour for generic advice. We deliver tailored AI solutions at a fraction of the cost, designed for organisations of 50–500 employees.' },
    { n: '04', t: 'We build, not just advise.', p: 'Strategy is worthless without execution. We go from roadmap to deployed solution, handling the full lifecycle — including the maintenance contract afterwards.' },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div><div className="eyebrow">Why ampl-ai</div></div>
          <div>
            <h2 className="serif">Not another consultancy.<br/>An AI-native partner.</h2>
            <p className="lede">Four principles that govern every engagement, written down and shared with every client on day one.</p>
          </div>
        </div>
        <div className="pillars-grid">
          {items.map((it, i) => (
            <div className={'pillar reveal reveal-' + ((i % 3) + 1)} key={it.n}>
              <div className="num">— {it.n}</div>
              <h3>{it.t}</h3>
              <p>{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteSection() {
  return (
    <section className="quote container-narrow">
      <div className="rule"></div>
      <p className="text">
        We do not sell decks. <span className="em">We map the workflow,
        ship a working system, and stay on to maintain it.</span> Strategy
        is cheap; execution is the work.
      </p>
      <div className="cite" style={{ marginTop: 36 }}>
        <div style={{ width: 28, height: 1, background: 'var(--brand-copper)' }}></div>
        <div>
          <div className="name">The ampl-ai operating principle</div>
        </div>
      </div>
    </section>
  );
}

function PrinciplesGrid() {
  const items = [
    { n: '01', t: 'Independent', p: 'No reseller agreements, no referral fees. We recommend the tool that fits, even when it is not the most lucrative for us.' },
    { n: '02', t: 'Practitioner-led', p: 'Every engagement is fronted by an operator who has shipped AI in production. No layering of junior account managers.' },
    { n: '03', t: 'Outcome-priced', p: 'We scope deliverables, not days. Pricing is fixed, milestones are written, and the maintenance contract is optional.' },
    { n: '04', t: 'Quietly built', p: 'No NPS surveys, no community Slack, no thought-leadership theatre. Just the work, on a quarterly review cadence.' },
  ];
  return (
    <div className="principles">
      {items.map((it) => (
        <div className="principle reveal" key={it.n}>
          <div className="n">{it.n.replace(/^0/,'')}<span className="small">/4</span></div>
          <h4>{it.t}</h4>
          <p>{it.p}</p>
        </div>
      ))}
    </div>
  );
}

function AboutBlock() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div><div className="eyebrow">About</div></div>
          <div>
            <h2 className="serif">Built by operators with years on the floor.</h2>
            <p className="lede">ampl-ai is a sibling of dalsson, built on the same partnership model — a named lead on every engagement, fixed-scope and fixed-price proposals, and a quarterly review cadence. Practitioner-led, hands-on, accountable.</p>
          </div>
        </div>
        <div className="about-lead">
          <div className="col-l">
            <p className="ds-drop">A small, senior team of operators and engineers based in Malmö. We have spent the last decade-plus shipping enterprise software inside large organisations — payroll, HR, planning, integration. We are now applying that discipline to AI.</p>
          </div>
          <div className="col-r">
            <p>ampl-ai shares its operating principles with dalsson: a named lead on every engagement, fixed-scope and fixed-price proposals, and a quarterly review cadence. The companies are new, the working method is not.</p>
            <p>We are not a reseller and we do not take referral fees. We are a small, deliberately-sized advisory that builds the AI it recommends — and stays around to maintain it.</p>
          </div>
        </div>
        <PrinciplesGrid />
      </div>
    </section>
  );
}

function ContactBlock() {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', org: '', email: '', note: '' });
  const h = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div><div className="eyebrow">Get started</div></div>
          <div>
            <h2 className="serif">Book your free AI audit.</h2>
            <p className="lede">Thirty minutes. No commitment. We will walk through your workflows and show you exactly where AI can save time and money. A named partner responds within one working day.</p>
          </div>
        </div>
        <div className="contact-grid">
          <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="field"><label>Full name</label><input value={form.name} onChange={h('name')} required /></div>
            <div className="field"><label>Company</label><input value={form.org} onChange={h('org')} /></div>
            <div className="field"><label>Work email</label><input type="email" value={form.email} onChange={h('email')} required /></div>
            <div className="field"><label>What is your biggest operational challenge right now?</label><textarea value={form.note} onChange={h('note')} placeholder="A few sentences on where you are and what you are considering." /></div>
            <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
              {sent ? 'Thank you — we will respond within one working day.' : 'Request your free audit →'}
            </button>
          </form>
          <aside className="contact-aside">
            <div className="eyebrow">Offices</div>
            <dl>
              <div><dt>Malmö</dt><dd>Dockgatan 45A<br/>211 73 Malmö</dd></div>
              <div><dt>Email</dt><dd className="ph">hello@ampl-ai.com</dd></div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SubHero({ eyebrow, title, dot, lede }) {
  return (
    <section className="sub-hero">
      <div className="hero-bg">
        <div className="grid"></div>
        <div className="aurora" style={{ height: 500, top: '50%' }}></div>
      </div>
      <div className="container hero-inner">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="serif">
          {title}{dot && <span className="pulse-dot"></span>}
        </h1>
        <p className="lede">{lede}</p>
      </div>
    </section>
  );
}

Object.assign(window, { ServicesGrid, ProcessList, PillarsGrid, QuoteSection, AboutBlock, PrinciplesGrid, ContactBlock, SubHero });
