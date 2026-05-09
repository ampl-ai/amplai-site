/* Chatbot — floating assistant in the bottom-right.
   Powered by Claude (window.claude.complete).
   Knows ampl-ai's services and is briefed to qualify and convert. */

const AMPL_SYSTEM_PROMPT = `You are the ampl-ai assistant — an AI concierge on the ampl-ai.com website.

ABOUT AMPL-AI
ampl-ai is a sibling firm of dalsson, an independent Workday consultancy. We are a small, senior team of operators and engineers based in Malmö. We help mid-market companies (50–500 employees) save time, cut costs, and grow revenue by integrating AI into daily workflows. We don't just advise — we build, deploy, and maintain.

OPERATING PRINCIPLES
- Practitioner-led: every engagement has a named partner from day one
- Fixed-scope, fixed-price proposals (no hourly billing)
- Quarterly review cadence
- We practise what we sell — our own business runs on AI
- Results in weeks, not quarters
- Built for the mid-market

OUR FIVE SERVICES
1. AI workflow consulting — we map operations, identify where AI saves time/money, deliver a prioritised roadmap with ROI projections.
2. AI-powered lead generation — automated pipelines that find, qualify, and contact ideal prospects.
3. Custom AI chatbots & automation — chatbots that integrate with HR/CRM/ERP and perform real actions, not just answer questions.
4. AI automation & system integration — multi-step workflows that connect tools (CRM ↔ finance ↔ HR), extract documents/invoices, route approvals.
5. AI training & workshops — half-day Foundations, Leaders sessions, department deep-dives (sales/HR/finance), prompt engineering masterclass. Workshop pricing starts around €2,500.

ENGAGEMENT MODEL
- Discovery call (Day 1, 30 minutes, free, no pitch)
- AI audit & roadmap (Week 1)
- Build & deploy (Weeks 2–6)
- Optimise & scale (ongoing)

YOUR JOB
- Answer questions accurately and concisely about ampl-ai, our services, our process, and how AI can help mid-market businesses.
- Qualify the visitor: ask about their company size, industry, biggest workflow pain, and what they've tried so far.
- When you have enough context, recommend the most relevant service(s) and steer them toward booking a free 30-minute discovery call. Do this naturally, not pushily.
- If they ask "how much" — explain we work fixed-scope/fixed-price and offer ranges where helpful (workshops €2,500–€8,000; integration packages €2,000–€30,000+ depending on scope; consulting scoped per project). Always say a discovery call is the fastest way to get a real number.
- If asked something you don't know (legal terms, specific case studies, named clients), say so honestly and offer to connect them with a partner.

TONE
- Crisp, confident, editorial — match the website's voice.
- No emoji. No exclamation marks. No marketing fluff like "amazing" or "game-changing".
- Use British English spellings (organisation, optimise, programme).
- Keep replies short — 2–4 sentences typically. Use a short bullet list only when genuinely helpful.
- Never invent metrics, clients, or case studies.

OUTPUT FORMAT
Plain text only. No markdown headers, no code blocks. Bullets are fine using "—" or "•".`;

const STARTER_PROMPTS = [
  'What does ampl-ai actually do?',
  'How fast can you deploy something?',
  'What does it cost?',
  'Can you train my team?',
];

function Chatbot() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { role: 'assistant', text: "Hi — I'm the ampl-ai assistant. Ask me anything about our services, process, or how AI could help your business. What are you working on?" },
  ]);
  const [draft, setDraft] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [unread, setUnread] = React.useState(false);
  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // Auto-scroll on new messages
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 250);
    }
  }, [open]);

  // Subtle "tap me" pulse: after 8s, if user hasn't opened, show unread dot once
  React.useEffect(() => {
    const t = setTimeout(() => { if (!open) setUnread(true); }, 8000);
    return () => clearTimeout(t);
  }, []);

  const send = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || busy) return;
    const newMsgs = [...messages, { role: 'user', text: trimmed }];
    setMessages(newMsgs);
    setDraft('');
    setBusy(true);

    try {
      const apiMessages = newMsgs.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: AMPL_SYSTEM_PROMPT, messages: apiMessages }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = (data && data.text) || '';
      if (!res.ok || !reply) {
        throw new Error((data && data.error) || 'No reply');
      }
      setMessages([...newMsgs, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMessages([...newMsgs, {
        role: 'assistant',
        text: "I'm having trouble connecting right now. You can email hello@ampl-ai.com or book a 30-minute call from the Contact page.",
      }]);
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(draft);
    }
  };

  const reset = () => {
    setMessages([
      { role: 'assistant', text: "Fresh start. What would you like to know about ampl-ai?" },
    ]);
  };

  return (
    <div className="cbot-root">
      {/* Panel */}
      <div className={'cbot-panel' + (open ? ' open' : '')} role="dialog" aria-label="ampl-ai assistant">
        <div className="cbot-head">
          <div className="cbot-head-l">
            <div className="cbot-avatar" aria-hidden>
              <span className="cbot-avatar-dot"></span>
            </div>
            <div className="cbot-head-text">
              <div className="cbot-name">ampl-ai assistant</div>
              <div className="cbot-status"><span className="cbot-pulse"></span> Online · powered by Claude</div>
            </div>
          </div>
          <div className="cbot-head-r">
            <button className="cbot-icon" onClick={reset} aria-label="Reset conversation" title="Reset">
              <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10a7 7 0 0 1 12-5l1.5 1.5"/>
                <path d="M16.5 3v3.5H13"/>
                <path d="M17 10a7 7 0 0 1-12 5L3.5 13.5"/>
                <path d="M3.5 17v-3.5H7"/>
              </svg>
            </button>
            <button className="cbot-icon" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M5 5l10 10M15 5L5 15"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="cbot-scroll" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={'cbot-msg cbot-msg--' + m.role}>
              {m.role === 'assistant' && (
                <div className="cbot-msg-avatar" aria-hidden>
                  <span className="cbot-avatar-dot"></span>
                </div>
              )}
              <div className="cbot-bubble">{m.text}</div>
            </div>
          ))}
          {busy && (
            <div className="cbot-msg cbot-msg--assistant">
              <div className="cbot-msg-avatar" aria-hidden>
                <span className="cbot-avatar-dot"></span>
              </div>
              <div className="cbot-bubble cbot-typing" aria-label="Assistant is typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          {messages.length <= 1 && !busy && (
            <div className="cbot-starters">
              <div className="cbot-starters-label">Suggested:</div>
              {STARTER_PROMPTS.map((p, i) => (
                <button key={i} className="cbot-starter" onClick={() => send(p)}>{p}</button>
              ))}
            </div>
          )}
        </div>

        <div className="cbot-input-wrap">
          <textarea
            ref={inputRef}
            className="cbot-input"
            value={draft}
            placeholder="Ask about services, process, pricing…"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            rows={1}
            disabled={busy}
          />
          <button
            className={'cbot-send' + (draft.trim() && !busy ? ' active' : '')}
            onClick={() => send(draft)}
            disabled={!draft.trim() || busy}
            aria-label="Send"
          >
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10l14-7-7 14-2-6-5-1z"/>
            </svg>
          </button>
        </div>
        <div className="cbot-foot">
          AI-generated · for binding answers, <a href="mailto:hello@ampl-ai.com">email a partner</a>
        </div>
      </div>

      {/* Launcher */}
      <button
        className={'cbot-launcher' + (open ? ' open' : '') + (unread ? ' unread' : '')}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
      >
        <span className="cbot-launcher-ring"></span>
        <span className="cbot-launcher-icon" aria-hidden>
          {open ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-5A8 8 0 1 1 21 12z"/>
              <circle cx="9" cy="12" r="0.8" fill="currentColor"/>
              <circle cx="13" cy="12" r="0.8" fill="currentColor"/>
              <circle cx="17" cy="12" r="0.8" fill="currentColor"/>
            </svg>
          )}
        </span>
        {!open && <span className="cbot-launcher-label">Ask ampl-ai</span>}
      </button>
    </div>
  );
}

Object.assign(window, { Chatbot });
