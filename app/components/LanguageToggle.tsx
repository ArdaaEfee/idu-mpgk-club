'use client'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium transition"
      aria-label="Toggle language"
    >
      {language === 'tr' ? 'EN' : 'TR'}
    </button>
  )
}