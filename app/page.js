'use client'
import { useState, useEffect, useRef } from 'react'
import Chatbot from './components/Chatbot'

const C = { ink:"#0A0F1C", charcoal:"#1A1F2E", slate:"#2D3348", muted:"#6B7394", silver:"#9BA3BF", white:"#FFFFFF", blue:"#3B82F6", blueHover:"#2563EB", glow:"rgba(59,130,246,0.12)", green:"#10B981" }
const F = "'Sora', sans-serif"

function useInView(t=0.15) {
  const ref=useRef(null); const [v,setV]=useState(false)
  useEffect(()=>{ const el=ref.current; if(!el) return; const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect()}},{threshold:t}); o.observe(el); return()=>o.disconnect() },[])
  return [ref,v]
}

function FadeIn({children,delay=0,style={}}){
  const [ref,v]=useInView()
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:`opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,...style}}>{children}</div>
}

function Nav(){
  const [scrolled,setScrolled]=useState(false)
  const [menuOpen,setMenuOpen]=useState(false)
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[])
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled||menuOpen?"rgba(10,15,28,0.92)":"transparent",backdropFilter:scrolled||menuOpen?"blur(16px)":"none",borderBottom:scrolled?"1px solid rgba(59,130,246,0.1)":"1px solid transparent",transition:"all 0.3s ease"}}>
      <div style={{maxWidth:1140,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#fff",fontWeight:700,fontSize:15,fontFamily:F}}>A</span>
          </div>
          <span style={{fontSize:19,fontWeight:600,color:C.white,fontFamily:F,letterSpacing:"-0.02em"}}>ampl<span style={{color:C.blue}}>ai</span></span>
        </div>
        <div className="nav-links">
          {["Services","Process","About"].map(item=><a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>)}
          <a href="#contact" className="nav-cta">Book a free audit</a>
        </div>
        <button className="hamburger" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menu">
          <span style={{display:"block",width:20,height:2,background:C.white,borderRadius:1,transition:"all 0.3s",transform:menuOpen?"rotate(45deg) translateY(3.5px)":"none"}}/>
          <span style={{display:"block",width:20,height:2,background:C.white,borderRadius:1,transition:"all 0.3s",opacity:menuOpen?0:1,marginTop:5}}/>
          <span style={{display:"block",width:20,height:2,background:C.white,borderRadius:1,transition:"all 0.3s",transform:menuOpen?"rotate(-45deg) translateY(-3.5px)":"none",marginTop:menuOpen?-2:5}}/>
        </button>
      </div>
      {menuOpen&&<div className="mobile-menu">
        {["Services","Process","About"].map(item=><a key={item} href={`#${item.toLowerCase()}`} onClick={()=>setMenuOpen(false)} style={{display:"block",padding:"14px 24px",color:C.silver,fontSize:16,textDecoration:"none",fontFamily:F,borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{item}</a>)}
        <div style={{padding:"16px 24px"}}><a href="#contact" onClick={()=>setMenuOpen(false)} style={{display:"block",background:C.blue,color:C.white,padding:"12px 24px",borderRadius:10,fontSize:15,fontWeight:500,textDecoration:"none",fontFamily:F,textAlign:"center"}}>Book a free audit</a></div>
      </div>}
    </nav>
  )
}

function Hero(){
  return(
    <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.ink,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"20%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(59,130,246,0.07) 1px, transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none",opacity:0.5}}/>
      <div style={{maxWidth:800,margin:"0 auto",padding:"120px 24px 80px",textAlign:"center",position:"relative"}}>
        <FadeIn>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",background:"rgba(59,130,246,0.1)",borderRadius:100,marginBottom:32,border:"1px solid rgba(59,130,246,0.15)"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#34D399"}}/>
            <span style={{fontSize:13,color:C.silver,fontFamily:F}}>Based in Sweden — serving companies across Europe</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 style={{fontSize:"clamp(36px, 5.5vw, 64px)",fontWeight:700,color:C.white,lineHeight:1.1,margin:"0 0 24px",fontFamily:F,letterSpacing:"-0.03em"}}>
            Amplify every part<br/>of your business<span style={{color:C.blue}}> with AI</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p style={{fontSize:18,color:C.silver,maxWidth:560,margin:"0 auto 40px",lineHeight:1.7,fontFamily:F,fontWeight:300}}>
            We help mid-market companies save time, cut costs, and grow revenue by integrating AI into daily workflows. We don&apos;t just advise — we build, deploy, and maintain.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="#contact" style={{background:C.blue,color:C.white,padding:"14px 32px",borderRadius:10,fontSize:16,fontWeight:500,textDecoration:"none",fontFamily:F,boxShadow:"0 0 40px rgba(59,130,246,0.25)"}}>Book a free AI audit →</a>
            <a href="#services" style={{background:"transparent",color:C.silver,padding:"14px 32px",borderRadius:10,fontSize:16,fontWeight:500,textDecoration:"none",fontFamily:F,border:`1px solid ${C.slate}`}}>See what we do</a>
          </div>
        </FadeIn>
        <FadeIn delay={0.5}>
          <div style={{display:"flex",justifyContent:"center",gap:48,marginTop:64,flexWrap:"wrap"}}>
            {[["80%","of operational work automated"],["3x","faster than traditional consulting"],["< 90 days","to measurable ROI"]].map(([num,label])=>(
              <div key={num} style={{textAlign:"center"}}>
                <div style={{fontSize:28,fontWeight:700,color:C.blue,fontFamily:F}}>{num}</div>
                <div style={{fontSize:13,color:C.muted,fontFamily:F,maxWidth:140}}>{label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function Services(){
  const services=[
    {icon:"◇",title:"AI workflow consulting",desc:"We map your operations, identify where AI saves time and money, and deliver a prioritized implementation roadmap with real ROI projections.",features:["Workflow audit & opportunity matrix","Tool recommendations with cost-benefit analysis","Implementation roadmap","Custom build estimates"],color:C.blue,bg:"rgba(59,130,246,0.06)"},
    {icon:"◈",title:"AI-powered lead generation",desc:"Automated pipelines that find, qualify, and contact ideal prospects on autopilot — turning AI into your most productive sales team member.",features:["Automated prospect sourcing & enrichment","AI-personalized outreach sequences","Performance dashboards","Ongoing optimization"],color:"#8B5CF6",bg:"rgba(139,92,246,0.06)"},
    {icon:"◉",title:"Custom AI chatbots & automation",desc:"Intelligent chatbots that integrate with your systems and perform real actions — not just answer questions. HR, support, sales, and beyond.",features:["System integrations (HR, CRM, ERP)","Role-based access & data segregation","Knowledge base ingestion","Ongoing maintenance & updates"],color:"#10B981",bg:"rgba(16,185,129,0.06)"},
  ]
  return(
    <section id="services" style={{background:C.charcoal,padding:"clamp(60px,8vw,100px) 24px"}}>
      <div style={{maxWidth:1140,margin:"0 auto"}}>
        <FadeIn>
          <p style={{fontSize:13,fontWeight:600,color:C.blue,fontFamily:F,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>What we do</p>
          <h2 style={{fontSize:"clamp(28px, 4vw, 42px)",fontWeight:700,color:C.white,fontFamily:F,letterSpacing:"-0.02em",margin:"0 0 16px"}}>Three ways we amplify your business</h2>
          <p style={{fontSize:17,color:C.silver,maxWidth:540,lineHeight:1.7,fontFamily:F,fontWeight:300,marginBottom:"clamp(32px,5vw,56px)"}}>Whether you need strategy, leads, or intelligent automation — we deliver measurable results from day one.</p>
        </FadeIn>
        <div className="services-grid">
          {services.map((s,i)=>(
            <FadeIn key={s.title} delay={i*0.12}>
              <div style={{background:C.ink,borderRadius:16,padding:32,border:"1px solid rgba(255,255,255,0.06)",transition:"border-color 0.3s, transform 0.3s",height:"100%",display:"flex",flexDirection:"column"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color+"33";e.currentTarget.style.transform="translateY(-4px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{width:48,height:48,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:s.color,marginBottom:20}}>{s.icon}</div>
                <h3 style={{fontSize:20,fontWeight:600,color:C.white,fontFamily:F,margin:"0 0 12px"}}>{s.title}</h3>
                <p style={{fontSize:15,color:C.silver,lineHeight:1.7,fontFamily:F,fontWeight:300,margin:"0 0 24px",flex:1}}>{s.desc}</p>
                <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:20}}>
                  {s.features.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:5,height:5,borderRadius:"50%",background:s.color,flexShrink:0}}/><span style={{fontSize:14,color:C.silver,fontFamily:F}}>{f}</span></div>)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process(){
  const steps=[
    {num:"01",title:"Discovery call",desc:"30-minute conversation to understand your workflows, pain points, and goals. No commitment, no pitch.",time:"Day 1"},
    {num:"02",title:"AI audit & roadmap",desc:"We map your processes, identify high-impact AI opportunities, and deliver a plan with clear ROI projections.",time:"Week 1"},
    {num:"03",title:"Build & deploy",desc:"We implement the solutions — from workflow automations to custom chatbots — with your team involved at every checkpoint.",time:"Week 2–6"},
    {num:"04",title:"Optimize & scale",desc:"We monitor performance, refine the systems, and expand what's working. Most clients see measurable results within 90 days.",time:"Ongoing"},
  ]
  return(
    <section id="process" style={{background:C.ink,padding:"clamp(60px,8vw,100px) 24px"}}>
      <div style={{maxWidth:1140,margin:"0 auto"}}>
        <FadeIn>
          <p style={{fontSize:13,fontWeight:600,color:C.blue,fontFamily:F,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>How it works</p>
          <h2 style={{fontSize:"clamp(28px, 4vw, 42px)",fontWeight:700,color:C.white,fontFamily:F,letterSpacing:"-0.02em",margin:"0 0 clamp(32px,5vw,56px)"}}>From first call to measurable results</h2>
        </FadeIn>
        <div className="process-grid">
          {steps.map((s,i)=>(
            <FadeIn key={s.num} delay={i*0.1}>
              <div className="process-step" data-index={i} style={{padding:"32px 28px",position:"relative"}}>
                <span style={{fontSize:"clamp(36px,5vw,48px)",fontWeight:800,color:"rgba(59,130,246,0.08)",fontFamily:F,position:"absolute",top:16,right:20}}>{s.num}</span>
                <span style={{fontSize:12,fontWeight:500,color:C.blue,fontFamily:F,background:C.glow,padding:"4px 10px",borderRadius:4}}>{s.time}</span>
                <h3 style={{fontSize:18,fontWeight:600,color:C.white,fontFamily:F,margin:"16px 0 10px"}}>{s.title}</h3>
                <p style={{fontSize:14,color:C.silver,lineHeight:1.7,fontFamily:F,fontWeight:300,margin:0}}>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyUs(){
  const points=[
    {title:"We practice what we sell",desc:"Our own business runs on AI. Every proposal, report, and outreach campaign is AI-assisted. We're not theorists — we're practitioners."},
    {title:"Results in weeks, not quarters",desc:"Traditional consultancies deliver a PowerPoint in 3 months. We deliver working solutions in 3 weeks."},
    {title:"Built for mid-market",desc:"Enterprise consultancies charge €300/hour for generic advice. We deliver tailored AI solutions at a fraction of the cost, designed for companies with 50–500 employees."},
    {title:"We build, not just advise",desc:"Strategy is worthless without execution. We go from roadmap to deployed solution, handling the full lifecycle."},
  ]
  return(
    <section id="about" style={{background:C.charcoal,padding:"clamp(60px,8vw,100px) 24px"}}>
      <div style={{maxWidth:1140,margin:"0 auto"}}>
        <FadeIn>
          <p style={{fontSize:13,fontWeight:600,color:C.blue,fontFamily:F,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Why Amplai</p>
          <h2 style={{fontSize:"clamp(28px, 4vw, 42px)",fontWeight:700,color:C.white,fontFamily:F,letterSpacing:"-0.02em",margin:"0 0 clamp(32px,5vw,56px)"}}>Not another consultancy. An AI-native partner.</h2>
        </FadeIn>
        <div className="whyus-grid">
          {points.map((p,i)=>(
            <FadeIn key={p.title} delay={i*0.1}>
              <div style={{padding:"28px 0",borderTop:`2px solid ${i===0?C.blue:"rgba(255,255,255,0.06)"}`}}>
                <h3 style={{fontSize:17,fontWeight:600,color:C.white,fontFamily:F,margin:"0 0 10px"}}>{p.title}</h3>
                <p style={{fontSize:14,color:C.silver,lineHeight:1.7,fontFamily:F,fontWeight:300,margin:0}}>{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact(){
  const [sent,setSent]=useState(false)
  const is={width:"100%",padding:"12px 16px",background:C.charcoal,border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:C.white,fontSize:15,fontFamily:F,outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"}
  return(
    <section id="contact" style={{background:C.ink,padding:"clamp(60px,8vw,100px) 24px",position:"relative"}}>
      <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:800,height:400,borderRadius:"50%",background:"radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",pointerEvents:"none"}}/>
      <div style={{maxWidth:640,margin:"0 auto",textAlign:"center",position:"relative"}}>
        <FadeIn>
          <p style={{fontSize:13,fontWeight:600,color:C.blue,fontFamily:F,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Get started</p>
          <h2 style={{fontSize:"clamp(28px, 4vw, 42px)",fontWeight:700,color:C.white,fontFamily:F,letterSpacing:"-0.02em",margin:"0 0 16px"}}>Book your free AI audit</h2>
          <p style={{fontSize:17,color:C.silver,lineHeight:1.7,fontFamily:F,fontWeight:300,margin:"0 0 40px"}}>30 minutes. No commitment. We&apos;ll walk through your workflows and show you exactly where AI can save you time and money.</p>
        </FadeIn>
        {!sent?(
          <FadeIn delay={0.15}>
            <div style={{display:"flex",flexDirection:"column",gap:16,textAlign:"left"}}>
              <div className="form-row">
                <div style={{flex:1}}><label style={{fontSize:13,color:C.silver,fontFamily:F,marginBottom:6,display:"block"}}>Name</label><input type="text" placeholder="Your name" style={is} onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}/></div>
                <div style={{flex:1}}><label style={{fontSize:13,color:C.silver,fontFamily:F,marginBottom:6,display:"block"}}>Company</label><input type="text" placeholder="Company name" style={is} onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}/></div>
              </div>
              <div><label style={{fontSize:13,color:C.silver,fontFamily:F,marginBottom:6,display:"block"}}>Email</label><input type="email" placeholder="you@company.com" style={is} onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}/></div>
              <div><label style={{fontSize:13,color:C.silver,fontFamily:F,marginBottom:6,display:"block"}}>What&apos;s your biggest operational challenge right now?</label><textarea rows={3} placeholder="Tell us briefly..." style={{...is,resize:"vertical"}} onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}/></div>
              <button onClick={()=>setSent(true)} style={{background:C.blue,color:C.white,padding:"14px 32px",borderRadius:10,fontSize:16,fontWeight:500,border:"none",cursor:"pointer",fontFamily:F,boxShadow:"0 0 40px rgba(59,130,246,0.2)",width:"100%"}}
                onMouseEnter={e=>e.target.style.background=C.blueHover} onMouseLeave={e=>e.target.style.background=C.blue}>
                Request your free audit →
              </button>
            </div>
          </FadeIn>
        ):(
          <FadeIn>
            <div style={{padding:40,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.15)",borderRadius:16}}>
              <div style={{fontSize:32,marginBottom:16,color:C.green}}>✓</div>
              <h3 style={{fontSize:20,fontWeight:600,color:C.white,fontFamily:F,margin:"0 0 8px"}}>Request received</h3>
              <p style={{fontSize:15,color:C.silver,fontFamily:F,margin:0}}>We&apos;ll be in touch within 24 hours to schedule your audit.</p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}

function Footer(){
  return(
    <footer style={{background:C.ink,borderTop:"1px solid rgba(255,255,255,0.04)",padding:"40px 24px"}}>
      <div className="footer-inner">
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:24,height:24,borderRadius:6,background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontWeight:700,fontSize:11,fontFamily:F}}>A</span></div>
          <span style={{fontSize:15,fontWeight:600,color:C.muted,fontFamily:F}}>ampl<span style={{color:C.blue}}>ai</span></span>
        </div>
        <div style={{display:"flex",gap:24}}>{["LinkedIn","Email","Privacy"].map(item=><a key={item} href="#" style={{color:C.muted,fontSize:13,textDecoration:"none",fontFamily:F}}>{item}</a>)}</div>
        <p style={{fontSize:13,color:C.slate,fontFamily:F,margin:0}}>© 2026 Amplai. Stockholm, Sweden.</p>
      </div>
    </footer>
  )
}

export default function Home(){
  return(
    <main>
      <Nav/><Hero/><Services/><Process/><WhyUs/><Contact/><Footer/><Chatbot/>
    </main>
  )
}
