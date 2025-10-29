import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SocketProvider } from '@/hooks/use-socket'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'QuizMaster',
  description: 'Multiplayer Quiz Game',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{colorScheme: "dark"}}>
      <body className={`font-sans antialiased bg-black`}>
        <SocketProvider>
          {children}
        </SocketProvider>
        <Analytics />
      </body>
    </html>
  )
}
