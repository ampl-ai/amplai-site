/* App router — single-page nav between Home / Product / Services / About / Contact */

function App() {
  const [page, setPage] = React.useState('Home');
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => { window.scrollTo({ top: 0 }); }, [page]);

  // run reveal observer on every page change
  useReveal();
  React.useEffect(() => {
    // reset reveals on route change
    document.querySelectorAll('.reveal.in').forEach(el => el.classList.remove('in'));
  }, [page]);

  return (
    <div data-screen-label={page}>
      <Nav page={page} setPage={setPage} scrolled={scrolled} />
      {page === 'Home' && (
        <main className="page-enter">
          <Hero setPage={setPage} />
          <StatsStrip />
          <ServicesGrid setPage={setPage} />
          <ProcessList />
          <QuoteSection />
          <PillarsGrid />
        </main>
      )}
      {page === 'Product' && (
        <main className="page-enter">
          <SubHero
            eyebrow="How it works"
            title="From first call to working AI"
            dot
            lede="A four-stage engagement designed for mid-market velocity. Most clients move from discovery to deployed solution in under six weeks."
          />
          <ProcessList />
          <StatsStrip />
          <QuoteSection />
        </main>
      )}
      {page === 'Services' && (
        <main className="page-enter">
          <SubHero
            eyebrow="What we do"
            title="Five ways we amplify your business"
            dot
            lede="Workflow consulting, lead generation, custom chatbots, system integration, and team training. Each engagement is fixed-scope, fixed-price, with a named partner from day one."
          />
          <ServicesGrid setPage={setPage} />
          <PillarsGrid />
        </main>
      )}
      {page === 'About' && (
        <main className="page-enter">
          <SubHero
            eyebrow="About"
            title="Practitioners, not theorists"
            dot
            lede="A small, senior team of operators and engineers. Founded inside dalsson, the independent Workday consultancy — sixteen years of disciplined delivery, applied to AI."
          />
          <AboutBlock />
        </main>
      )}
      {page === 'Contact' && (
        <main className="page-enter">
          <SubHero
            eyebrow="Get started"
            title="Start with a 30-minute call"
            dot
            lede="No commitment, no pitch. A named partner responds within one working day."
          />
          <ContactBlock />
        </main>
      )}
      <Footer setPage={setPage} />
      <Chatbot />
      <Analytics />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
