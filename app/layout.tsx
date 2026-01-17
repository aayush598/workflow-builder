import './globals.css'
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'Weavy.ai - AI Workflow Builder',
  description: 'Build powerful AI workflows with our visual node-based editor',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}