import './globals.css'

export const metadata = {
  title: 'Amplai | AI Consulting & Automation for Mid-Market Companies',
  description: 'We help companies with 50-500 employees save time, cut costs, and grow revenue by integrating AI into daily workflows. Based in Stockholm, Sweden.',
  keywords: 'AI consulting, AI automation, AI chatbots, lead generation, AI training, Stockholm, Sweden',
  authors: [{ name: 'Amplai' }],
  openGraph: {
    title: 'Amplai | Amplify Your Business with AI',
    description: 'AI Workflow Consulting • Lead Generation • Chatbots • Automation • Training. Free AI audit available.',
    url: 'https://ampl-ai.com',
    siteName: 'Amplai',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amplai | Amplify Your Business with AI',
    description: 'AI consulting and automation for mid-market companies. Based in Stockholm.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://ampl-ai.com'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
