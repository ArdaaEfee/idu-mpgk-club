'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'tr' | 'en'

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  tr: {
    'home': 'Ana Sayfa',
    'about': 'Hakkımızda',
    'projects': 'Projeler',
    'events': 'Etkinlikler',
    'contact': 'İletişim',
    'join_club': 'Kulübe Katıl',
    'hero_title': 'IDU Mühendislik Projeleri Geliştirme Kulübü',
    'hero_subtitle': 'İzmir Demokrasi Üniversitesi\'nde yenilikçi projeler, uygulamalı deneyim ve işbirlikçi öğrenme yoluyla geleceğin mühendislerini güçlendiriyoruz.',
    'view_projects': 'Projeleri Görüntüle',
    'about_title': 'MPGK Hakkında',
    'about_description': 'İzmir Demokrasi Üniversitesi Mühendislik Projeleri Geliştirme Kulübü (MPGK), gerçek dünya projeleri üzerinde çalışmak, teknik beceriler geliştirmek ve yeniliği teşvik etmek için tutkulu mühendislik öğrencilerini bir araya getirir.',
    'innovation': 'Yenilik',
    'innovation_desc': 'Gerçek dünya problemlerine çözümler geliştirme',
    'collaboration': 'İşbirliği',
    'collaboration_desc': 'Farklı mühendislik disiplinlerinde birlikte çalışma',
    'impact': 'Etki',
    'impact_desc': 'Topluluğumuzda fark yaratan projeler oluşturma',
    'projects_title': 'Projelerimiz',
    'projects_subtitle': 'Kulüp üyelerimiz tarafından geliştirilen yenilikçi projeleri keşfedin',
    'events_title': 'Yaklaşan Etkinlikler',
    'events_subtitle': 'Etkinliklerimize ve workshoplarımıza katılın',
    'contact_title': 'İletişime Geçin',
    'contact_subtitle': 'Bize katılmak veya işbirliği yapmak mı istiyorsunuz?',
    'name': 'Adınız',
    'email': 'E-posta',
    'message': 'Mesajınız',
    'send_message': 'Mesaj Gönder',
    'quick_links': 'Hızlı Bağlantılar',
    'copyright': '© 2024 IDU Mühendislik Projeleri Geliştirme Kulübü. Tüm hakları saklıdır.',
    'renewable_energy': 'Yenilenebilir Enerji',
    'sustainability': 'Sürdürülebilirlik',
    'robotics': 'Robotik',
    'engineering_projects_club': 'Mühendislik Geliştirme Projeleri Kulübü',
    'our_mission': 'Misyonumuz',
    'our_vision': 'Vizyonumuz',
    'view_all_projects': 'Tüm Projeleri Görüntüle',
    'view_all_events': 'Tüm Etkinlikleri Görüntüle'
  },
  en: {
    'home': 'Home',
    'about': 'About',
    'projects': 'Projects',
    'events': 'Events',
    'contact': 'Contact',
    'join_club': 'Join Club',
    'hero_title': 'IDU Engineering Projects Development Club',
    'hero_subtitle': 'Empowering future engineers at Izmir Democracy University through innovative projects, hands-on experience, and collaborative learning.',
    'view_projects': 'View Projects',
    'about_title': 'About MPGK',
    'about_description': 'The Engineering Projects Development Club (MPGK) at Izmir Democracy University brings together passionate engineering students to work on real-world projects, develop technical skills, and foster innovation.',
    'innovation': 'Innovation',
    'innovation_desc': 'Developing cutting-edge solutions to real-world problems',
    'collaboration': 'Collaboration',
    'collaboration_desc': 'Working together across different engineering disciplines',
    'impact': 'Impact',
    'impact_desc': 'Creating projects that make a difference in our community',
    'projects_title': 'Our Projects',
    'projects_subtitle': 'Explore the innovative projects developed by our club members',
    'events_title': 'Upcoming Events',
    'events_subtitle': 'Join our events and workshops',
    'contact_title': 'Get In Touch',
    'contact_subtitle': 'Interested in joining or collaborating with us?',
    'name': 'Name',
    'email': 'Email',
    'message': 'Message',
    'send_message': 'Send Message',
    'quick_links': 'Quick Links',
    'copyright': '© 2024 IDU Engineering Projects Development Club. All rights reserved.',
    'renewable_energy': 'Renewable Energy',
    'sustainability': 'Sustainability',
    'robotics': 'Robotics',
    'engineering_projects_club': 'Engineering Projects Club',
    'our_mission': 'Our Mission',
    'our_vision': 'Our Vision',
    'view_all_projects': 'View All Projects',
    'view_all_events': 'View All Events'
  }
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('tr')

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language
      if (saved) {
        setLanguage(saved)
      }
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'tr' ? 'en' : 'tr'
    setLanguage(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang)
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.tr] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Return default values instead of throwing error
    return {
      language: 'tr' as Language,
      toggleLanguage: () => {},
      t: (key: string) => key
    }
  }
  return context
}