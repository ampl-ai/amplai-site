'use client'
import { useState, useRef, useEffect } from 'react'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [unread, setUnread] = useState(1)
  const endRef = useRef(null)
  const inRef = useRef(null)

  const greeting = "Hey there! 👋 I'm the Amplai AI assistant. I can tell you about our services, pricing, or help you book a free AI audit. What can I help with?"

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs])
  useEffect(() => { if (open) { setUnread(0); setTimeout(() => inRef.current?.focus(), 150) } }, [open])

  async function send(text) {
    const t = text || input.trim()
    if (!t || busy) return
    setInput("")

    const updated = [...msgs, { role: "user", content: t }]
    setMsgs(updated)
    setBusy(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      setMsgs(p => [...p, { role: "assistant", content: data.reply }])
    } catch (err) {
      setMsgs(p => [...p, {
        role: "assistant",
        content: "I'm having a connection issue. You can reach us directly at hello@ampl-ai.com or book your free audit at ampl-ai.com."
      }])
    }
    setBusy(false)
  }

  const quicks = [
    "What services do you offer?",
    "How does the free audit work?",
    "Tell me about chatbots",
    "What are your prices?",
  ]

  const all = [{ role: "assistant", content: greeting }, ...msgs]

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
      <style>{`
        @keyframes chatSlide{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes chatDot{0%,80%,100%{opacity:.3}40%{opacity:1}}
        .chat-u{background:#3B82F6;color:#fff;border-radius:16px 16px 4px 16px;margin-left:40px}
        .chat-b{background:#F1F5F9;color:#1E293B;border-radius:16px 16px 16px 4px;margin-right:40px}
        .chat-in:focus{outline:none;border-color:#3B82F6}
        .chat-q:hover{background:#EBF2FF!important;border-color:#3B82F6!important}
        .chat-send:hover{background:#2563EB!important}
      `}</style>

      {open && (
        <div style={{
          width: 370, height: 540, background: "#fff", borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,.15), 0 2px 8px rgba(0,0,0,.08)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          marginBottom: 16, border: "1px solid rgba(0,0,0,.06)",
          animation: "chatSlide .3s ease",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg,#0A0F1C,#1A1F2E)",
            padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>A</span>
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Amplai Assistant</div>
                <div style={{ color: "#9BA3BF", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", display: "inline-block" }} />
                  Online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: "rgba(255,255,255,.1)", border: "none", color: "#9BA3BF",
              width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
            {all.map((m, i) => (
              <div key={i} className={m.role === "user" ? "chat-u" : "chat-b"}
                style={{ padding: "10px 14px", fontSize: 13.5, lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="chat-b" style={{ padding: "12px 14px", display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#94A3B8",
                    animation: `chatDot 1.2s ease infinite`, animationDelay: `${i * .15}s`,
                  }} />
                ))}
              </div>
            )}
            {msgs.length === 0 && !busy && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {quicks.map(q => (
                  <button key={q} className="chat-q" onClick={() => send(q)}
                    style={{
                      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20,
                      padding: "6px 12px", fontSize: 12, color: "#3B82F6", cursor: "pointer",
                      fontFamily: "inherit", transition: "all .15s",
                    }}>{q}</button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 14px", borderTop: "1px solid #F1F5F9", display: "flex", gap: 8, alignItems: "center" }}>
            <input ref={inRef} className="chat-in" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask anything about Amplai..."
              style={{
                flex: 1, padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 12,
                fontSize: 14, fontFamily: "inherit", background: "#F8FAFC", transition: "border-color .2s",
              }}
            />
            <button className="chat-send" onClick={() => send()} disabled={!input.trim() || busy}
              style={{
                width: 40, height: 40, borderRadius: 12, background: "#3B82F6", border: "none",
                cursor: input.trim() && !busy ? "pointer" : "default", display: "flex",
                alignItems: "center", justifyContent: "center", transition: "background .2s",
                opacity: input.trim() && !busy ? 1 : .4, flexShrink: 0,
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div style={{ textAlign: "center", padding: "4px 0 8px", fontSize: 11, color: "#94A3B8" }}>
            Powered by <strong style={{ color: "#64748B" }}>Amplai</strong>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button onClick={() => setOpen(!open)} style={{
        width: 56, height: 56, borderRadius: 16, border: "none", cursor: "pointer",
        background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
        boxShadow: "0 4px 16px rgba(59,130,246,.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform .2s, box-shadow .2s", position: "relative",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(59,130,246,.45)" }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,130,246,.35)" }}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {unread > 0 && !open && (
          <span style={{
            position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: "50%",
            background: "#EF4444", color: "#fff", fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff",
          }}>1</span>
        )}
      </button>
    </div>
  )
}
