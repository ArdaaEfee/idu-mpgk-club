import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IDU MPGK - Mühendislik Projeleri Geliştirme Kulübü',
  description: 'İzmir Demokrasi Üniversitesi Mühendislik Projeleri Geliştirme Kulübü - Mühendislik projeleriyle geleceği yeniliyoruz',
  icons: {
    icon: '/logo.png?v=2',
    apple: '/logo.png?v=2',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
