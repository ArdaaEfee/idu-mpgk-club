'use client'
import Footer from '../components/Footer'
import { useLanguage } from '../contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold text-center mb-8">{t('about_title')}</h1>
          
          <div className="card p-8 max-w-4xl mx-auto">
            <p className="text-lg mb-6">{t('about_description')}</p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-idu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('our_mission')}</h3>
                <p className="text-gray-600 dark:text-gray-300">Öğrencilere pratik mühendislik deneyimi kazandırmak</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-idu-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('our_vision')}</h3>
                <p className="text-gray-600 dark:text-gray-300">Geleceğin mühendislerini yetiştirmek</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}