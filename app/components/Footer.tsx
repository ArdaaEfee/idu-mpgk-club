'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Club Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white">
                <Image src="/favicon.ico" alt="Logo" width={40} height={40} className="object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-bold">IDU MPGK</h2>
                <p className="text-gray-400">{t('engineering_projects_club')}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              {t('about_description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('quick_links')}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">{t('home')}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">{t('about')}</Link></li>
              <li><Link href="/projects" className="text-gray-400 hover:text-white transition">{t('projects')}</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white transition">{t('events')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">İletişim</h3>
            <ul className="space-y-2 text-gray-400">
              <li>İzmir Demokrasi Üniversitesi</li>
              <li>Mühendislik Fakültesi</li>
              <li>İzmir, Türkiye</li>
              <li>mpgk2024idu@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}