import './globals.css'

export const metadata = {
  title: 'Weavy.ai - AI Workflow Builder',
  description: 'Build powerful AI workflows with our visual node-based editor',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}