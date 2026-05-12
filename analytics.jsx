/* Vercel Analytics integration for React CDN setup */

function Analytics() {
  React.useEffect(() => {
    // Initialize the queue if not already present
    if (window.va) return;
    
    window.va = function(...params) {
      if (!window.vaq) window.vaq = [];
      window.vaq.push(params);
    };

    // Check if script already loaded
    const src = '/_vercel/insights/script.js';
    if (document.head.querySelector(`script[src*="${src}"]`)) return;

    // Create and inject the script
    const script = document.createElement('script');
    script.src = src;
    script.dataset.sdkn = '@vercel/analytics/react';
    script.dataset.sdkv = '2.0.1';
    script.defer = true;
    script.onerror = () => {
      console.log(
        '[Vercel Web Analytics] Failed to load script. ' +
        'Be sure to enable Web Analytics for your project and deploy to Vercel. ' +
        'See https://vercel.com/docs/analytics/quickstart for more information.'
      );
    };
    
    document.head.appendChild(script);
  }, []);

  return null;
}
