/* Nav + Footer chrome
   Exposes: Nav, Footer
*/

function Nav({ page, setPage, scrolled, surface }) {
  const links = [
    { k: 'Home', label: 'Home' },
    { k: 'Product', label: 'How it works' },
    { k: 'Services', label: 'Services' },
    { k: 'About', label: 'About' },
    { k: 'Contact', label: 'Contact' },
  ];
  return (
    <header className={'nav' + (scrolled ? ' scrolled' : '')}>
      <div className="container nav-inner">
        <div className="nav-brand" onClick={() => setPage('Home')} style={{ cursor: 'pointer' }}>
          <Logo size={36} animated={false} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span className="name">ampl<span style={{ color: 'var(--brand-copper)' }}>·</span>ai</span>
            <span className="by">by dalsson<span className="d">.</span></span>
          </div>
        </div>
        <nav className="nav-links">
          {links.map(l => (
            <span key={l.k}
              className={'nav-link' + (page === l.k ? ' active' : '')}
              onClick={() => setPage(l.k)}>{l.label}</span>
          ))}
        </nav>
        <button className="nav-cta" onClick={() => setPage('Contact')}>Book a free audit</button>
      </div>
    </header>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo size={48} animated={false} />
            <div className="name">ampl<span style={{ color: 'var(--brand-copper)' }}>·</span>ai</div>
            <div className="by">by dalsson<span className="d">.</span></div>
            <div className="desc">AI consulting and automation for mid-market companies. Independent. Practitioner-led.</div>
          </div>
          <div className="footer-col">
            <h4>What we do</h4>
            <a onClick={() => setPage('Services')}>AI workflow consulting</a>
            <a onClick={() => setPage('Services')}>AI lead generation</a>
            <a onClick={() => setPage('Services')}>Custom chatbots</a>
            <a onClick={() => setPage('Product')}>How it works</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a onClick={() => setPage('About')}>About</a>
            <a onClick={() => setPage('Contact')}>Contact</a>
            <a href="https://dalsson.com" target="_blank" rel="noreferrer">dalsson.com</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a>Privacy</a>
            <a>Terms</a>
            <a>Cookies</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ampl-ai by dalsson · malmö</span>
          <span>est. 2026 · sibling of dalsson consulting</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Footer });
