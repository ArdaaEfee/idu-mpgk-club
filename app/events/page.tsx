'use client'
import Footer from '../components/Footer'
import { useLanguage } from '../contexts/LanguageContext'
import { useEffect, useState } from 'react'

export default function EventsPage() {
  const { t, language } = useLanguage()

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')
    }
    return dateStr
  }

  const [highlightId, setHighlightId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (hash && hash.startsWith('#event-')) {
      const id = hash.slice(1)
      setHighlightId(id)
      const el = document.getElementById(id)
      if (el) {
        // smooth scroll the highlighted event into view
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      // Match the animation duration (2s) so highlight removal aligns with the visual
      const timeoutHandle = setTimeout(() => setHighlightId(null), 2000)
      return () => clearTimeout(timeoutHandle)
    }
  }, [])

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold text-center mb-8">{t('events_title')}</h1>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {events.map((event, index) => (
              <div
                key={index}
                id={`event-${index}`}
                className={"card p-6 " + (highlightId === `event-${index}` ? 'ring-4 ring-blue-300 bg-blue-50 dark:bg-blue-900/20 animate-breath animate-highlight' : '')}
              >
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{event.description}</p>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>📅 {formatDate(event.date)}</span>
                  <span>📍 {event.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}