import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IDU MPGK - Mühendislik Projeleri Geliştirme Kulübü',
  description: 'İzmir Demokrasi Üniversitesi Mühendislik Projeleri Geliştirme Kulübü - Mühendislik projeleriyle geleceği yeniliyoruz',
  // icons kısmını tamamen kaldırdık. 
  // Next.js artık app klasöründeki favicon.ico dosyasını otomatik algılayıp kullanacak.
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
} 