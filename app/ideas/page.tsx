'use client'
import { useState } from 'react'
import Footer from '../components/Footer'
import { useLanguage } from '../contexts/LanguageContext'

export default function IdeasPage() {
  const { t, language } = useLanguage()
  // BURASI DEĞİŞTİ: fileLink eklendi
  const [formData, setFormData] = useState({ name: '', email: '', projectTitle: '', description: '', fileLink: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: null, message: '' })

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setStatus({ type: 'success', message: t('idea_success') })
        // BURASI DEĞİŞTİ: Form temizlenirken fileLink de temizleniyor
        setFormData({ name: '', email: '', projectTitle: '', description: '', fileLink: '' })
      } else {
        setStatus({ type: 'error', message: t('idea_error') })
      }
    } catch (error) {
      setStatus({ type: 'error', message: t('send_error') })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex-grow pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('share_idea_title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('share_idea_desc')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                    {t('name')}
                  </label>
                  <input 
                    required type="text" name="name" value={formData.name} onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                    {t('email')}
                  </label>
                  <input 
                    required type="email" name="email" value={formData.email} onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  {t('project_title')}
                </label>
                <input 
                  required type="text" name="projectTitle" value={formData.projectTitle} onChange={handleChange} 
                  placeholder={t('project_title_placeholder')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                />
              </div>

              {/* YENİ EKLENEN KISIM: DOSYA LİNKİ KUTUSU */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  {language === 'tr' ? 'Dosya/Sunum Linki (Opsiyonel)' : 'File/Presentation Link (Optional)'}
                </label>
                <input 
                  type="url" 
                  name="fileLink" 
                  value={formData.fileLink} 
                  onChange={handleChange} 
                  placeholder="Google Drive, WeTransfer, GitHub vb."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  {t('idea_desc')}
                </label>
                <textarea 
                  required rows={5} name="description" value={formData.description} onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder={t('idea_desc_placeholder')}
                ></textarea>
              </div>

              {status.message && (
                <div className={`p-4 rounded-lg text-center font-medium ${
                  status.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}>
                  {status.message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isSubmitting ? t('sending') : t('submit_idea')}
              </button>

            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}