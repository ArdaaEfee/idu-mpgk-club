'use client'
import Footer from '../components/Footer'
import { useLanguage } from '../contexts/LanguageContext'
import { useState } from 'react'

export default function ContactPage() {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: language === 'tr' 
            ? 'Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.'
            : 'Your message has been sent successfully! We will contact you soon.'
        })
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || (language === 'tr' 
            ? 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
            : 'An error occurred while sending your message. Please try again.')
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: language === 'tr'
          ? 'Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin.'
          : 'Connection error occurred. Please check your internet connection.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('contact_title')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t('contact_subtitle')}</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="card p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('name')}</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('email')}</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('message')}</label>
                  <textarea 
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                {submitStatus.message && (
                  <div className={`text-sm animate-message ${
                    submitStatus.type === 'success' 
                      ? 'message-success'
                      : 'message-error'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting 
                    ? (language === 'tr' ? 'Gönderiliyor...' : 'Sending...')
                    : t('send_message')
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}