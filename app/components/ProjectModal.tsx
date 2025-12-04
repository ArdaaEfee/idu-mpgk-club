'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '../contexts/LanguageContext'

interface ProjectModalProps {
  project: {
    title: string
    description: string
    image: string
    technologies: string[]
    category: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { language } = useLanguage()

  // ESC tuşuna basıldığında modalı kapat
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Modal açık değilse hiçbir şey gösterme
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-80">
      {/* Arka plan overlay - tıklayınca kapat */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal içeriği */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Kapatma Butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          aria-label={language === 'tr' ? 'Kapat' : 'Close'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* İçerik */}
        <div className="grid l:grid-cols-2 gap-0">
          {/* Detaylar - Sağ taraf */}
          <div className="p-8 lg:p-10">
            <div className="mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {project.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                {language === 'tr' ? 'Kullanılan Teknolojiler' : 'Technologies Used'}
              </h4>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="btn-primary w-full py-3 text-lg"
              >
                {language === 'tr' ? 'Projeyi Kapat' : 'Close Project'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}