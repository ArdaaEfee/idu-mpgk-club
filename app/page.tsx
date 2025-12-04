'use client'
import ProjectCard from './components/ProjectCard'
import Footer from './components/Footer'
import { useLanguage } from './contexts/LanguageContext'
import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')
    }
    return dateStr
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setFormMessage('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setFormMessage(t('send_success') || 'Message sent successfully!')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setFormMessage(t('send_error') || 'Failed to send message.')
      }
    } catch (error) {
      setFormMessage(t('send_error') || 'An error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const projects = [
  {
    title: "KUZGUN - Yenilikçi SİHA Teknolojisi",
    description: "KUZGUN, ileri seviye mühendislik çözümleriyle geliştirilmiş, yüksek manevra kabiliyetine sahip yerli ve yenilikçi bir SİHA prototipidir. En dikkat çekici özelliği, uçuş sırasında belirli bir dereceye kadar açılıp kapanabilen kanat mekanizması sayesinde farklı görev profillerine uyum sağlayabilmesidir. Bu sayede hem yüksek hızda stabil uçuş hem de dar alanlarda kontrollü manevra imkânı sunar. KUZGUN’un gövde yapısı hafiflik ve dayanıklılık esas alınarak tasarlanmıştır. Otonom uçuş yetenekleri sayesinde görevini minimum insan müdahalesiyle yerine getirebilir. Modüler tasarımı, farklı sensör ve görev yüklerinin kolayca entegre edilebilmesine olanak tanır.",
    image: "/projects/kuzgun.png", // Gerçek fotoğraf
    technologies: ["Mikrodenetleyici tabanlı uçuş kontrol sistemi", "Değişken geometrili kanat (mekanik kanat açılma-kapanma sistemi)", "GPS destekli otonom navigasyon","PID tabanlı stabilizasyon algoritmaları", "Gerçek zamanlı telemetri ve yer istasyonu haberleşmesi"],
    category: t('SİHA')
  },
  {
    title: "KAPLAN - Yerli İnsansız Kara Aracı",
    description: "KAPLAN, yüksek hız, çeviklik ve görev sürekliliği esas alınarak geliştirilmiş yerli bir İnsansız Kara Aracı (İKA) prototipidir. Zorlu arazi koşullarında kesintisiz hareket edebilmesi için güçlü motor yapısı ve optimize edilmiş süspansiyon sistemine sahiptir. Modüler gövde tasarımı sayesinde farklı görev yükleri kolaylıkla entegre edilebilir. KAPLAN, uzaktan kontrol edilebildiği gibi yarı otonom sürüş modlarıyla da görev yapabilmektedir. Üzerinde bulunan sensörler sayesinde çevresini algılayarak güvenli ilerleme sağlar. Dayanıklı şasi yapısı, darbelere ve dış etkenlere karşı yüksek koruma sunar. Görev esnekliği ve arazi kabiliyetiyle KAPLAN, modern savunma teknolojilerine güçlü bir alternatif olarak öne çıkmaktadır.",
    image: "/projects/kaplan.png", // Gerçek fotoğraf
    technologies: ["Mikrodenetleyici tabanlı motor sürücü ve hareket kontrol sistemi", "Uzaktan kumanda ve RF haberleşme teknolojisi", "Ultrasonik / mesafe sensörleriyle çevre algılama", "Yarı otonom sürüş algoritmaları","Gerçek zamanlı telemetri sistemi"],
    category: t('İKA')
  }
]

  const events = [
    {
      title: language === 'tr' ? "Kulüp tanıtım günleri" : "Club promotion days",
      date: "1-5 Aralık 2025",
      location: language === 'tr' ? "Ana bina, giriş kat" : "Main building, ground floor",
      description: language === 'tr' 
        ? "Kulüp Tanıtım Günleri kapsamında, teknolojiye ve mühendisliğe ilgi duyan herkesi standımıza bekliyoruz!Ekip üyelerimizle birebir sohbet ederek çalışmalarımız hakkında detaylı bilgi alabilirsiniz. Atölye kültürü, yarışma süreçleri ve takım ruhunu birlikte keşfetmek için standımıza uğramayı unutmayın. Aramıza katıl, geleceği birlikte üretelim!"
        : "As part of the Club Promotion Days, we invite everyone who is interested in technology and engineering to visit our booth! You can have one-on-one conversations with our team members and get detailed information about our projects and activities. Don’t forget to stop by our booth to discover our workshop culture, competition processes, and team spirit. Join us, let’s build the future together!"
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-idu-blue text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">
            {t('hero_title')}
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {t('hero_subtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/join" className="btn-secondary">
              {t('join_club')}
            </Link>
            <Link href="/projects" className="bg-white text-idu-blue px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
              {t('view_projects')}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('about_title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('about_description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-idu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('innovation')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('innovation_desc')}</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-idu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('collaboration')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('collaboration_desc')}</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-idu-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('impact')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('impact_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('projects_title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('projects_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/projects" className="btn-primary">
              {t('view_all_projects')}
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('events_title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t('events_subtitle')}</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {events.map((event, index) => (
              <Link key={index} href={`/events#event-${index}`} className="block">
                <div id={`event-${index}`} className="card p-6 mb-4 hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{event.title}</h3>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>📅 {formatDate(event.date)}</span>
                    <span>📍 {event.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/events" className="btn-primary">
              {t('view_all_events')}
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('contact_title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t('contact_subtitle')}</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="card p-8">
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('name')}</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('email')}</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('message')}</label>
                  <textarea 
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isLoading ? t('sending') || 'Sending...' : t('send_message')}
                </button>
                {formMessage && (
                  <div className={`text-sm text-center animate-message ${formMessage.includes('success') ? 'message-success' : 'message-error'}`}>
                    {formMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}