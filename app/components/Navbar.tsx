'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext' // <-- Burası ../ ile düzeltildi
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { href: '/', label: 'home' },
    { href: '/about', label: 'about' },
    { href: '/projects', label: 'projects' },
    { href: '/ideas', label: 'idea_box' }, // <-- YENİ EKLENEN KISIM
    { href: '/events', label: 'events' },
    { href: '/contact', label: 'contact' },
    { href: '/join', label: 'join_club' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg fixed w-full z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
              <Image src="/favicon.ico" alt="Logo" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">IDU MPGK</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">{t('engineering_projects_club')}</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-gray-700 dark:text-gray-300 hover:text-idu-blue dark:hover:text-blue-400 transition text-sm font-medium whitespace-nowrap"
              >
                {t(item.label)}
              </Link>
            ))}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l dark:border-gray-700">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <LanguageToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white ml-2"
              aria-label="Toggle menu"
            >
              <div className="space-y-1">
                <div className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all ${isOpen ? 'transform rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all ${isOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all ${isOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="text-gray-700 dark:text-gray-300 hover:text-idu-blue dark:hover:text-blue-400 transition py-3 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  {t(item.label)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}