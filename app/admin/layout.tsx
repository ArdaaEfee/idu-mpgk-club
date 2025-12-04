export const metadata = {
  title: 'IDU MPGK - Admin Panel',
  description: 'IDU Mühendislik Projeleri Geliştirme Kulübü Yönetim Paneli',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  )
}