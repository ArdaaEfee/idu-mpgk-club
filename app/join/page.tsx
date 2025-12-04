'use client'
import Footer from '../components/Footer'
import { useLanguage } from '../contexts/LanguageContext'
import { useState } from 'react'

export default function JoinPage() {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    studentNumber: '', 
    department: '', 
    interests: '' 
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await fetch('/api/join', {
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
            ? 'Başvurunuz başarıyla alındı! Onaylandıktan sonra üye olacaksınız.'
            : 'Your application has been received! You will become a member after approval.'
        })
        setFormData({ 
          firstName: '', 
          lastName: '', 
          studentNumber: '', 
          department: '', 
          interests: '' 
        })
      } else {
        // DETAYLI HATA MESAJI
        const errorMessage = result.error || (language === 'tr' 
          ? `Başvuru gönderilirken bir hata oluştu. (${response.status})`
          : `An error occurred while submitting your application. (${response.status})`)
        
        setSubmitStatus({
          type: 'error',
          message: errorMessage
        })
      }
    } catch (error) {
      console.error('Fetch hatası:', error)
      setSubmitStatus({
        type: 'error',
        message: language === 'tr'
          ? `Bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.`
          : `Connection error occurred. Please try again later.`
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
            <h1 className="text-4xl font-bold mb-4">
              {language === 'tr' ? 'Kulübe Katılın' : 'Join the Club'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {language === 'tr' ? 'MPGK ailesinin bir parçası olun' : 'Become part of the MPGK family'}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="card p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'tr' ? 'Adınız' : 'First Name'} *
                    </label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'tr' ? 'Soyadınız' : 'Last Name'} *
                    </label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'tr' ? 'Öğrenci Numarası' : 'Student Number'} *
                  </label>
                  <input 
                    type="text" 
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'tr' ? 'Bölümünüz' : 'Your Department'} *
                  </label>
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">{language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                    <option value={language === 'tr' ? 'Bilgisayar Mühendisliği' : 'Computer Engineering'}>
                      {language === 'tr' ? 'Bilgisayar Mühendisliği' : 'Computer Engineering'}
                    </option>
                    <option value={language === 'tr' ? 'Elektrik-Elektronik Mühendisliği' : 'Electrical-Electronics Engineering'}>
                      {language === 'tr' ? 'Elektrik-Elektronik Mühendisliği' : 'Electrical-Electronics Engineering'}
                    </option>
                    <option value={language === 'tr' ? 'Makine Mühendisliği' : 'Mechanical Engineering'}>
                      {language === 'tr' ? 'Makine Mühendisliği' : 'Mechanical Engineering'}
                    </option>
                    <option value={language === 'tr' ? 'İnşaat Mühendisliği' : 'Civil Engineering'}>
                      {language === 'tr' ? 'İnşaat Mühendisliği' : 'Civil Engineering'}
                    </option>
                                        <option value={language === 'tr' ? 'Biyomedikal Mühendisliği' : 'Biomedical Engineering'}>
                      {language === 'tr' ? 'Biyomedikal Mühendisliği' : 'Biomedical Engineering'}
                    </option>
                    <option value={language === 'tr' ? 'Diğer' : 'Other'}>
                      {language === 'tr' ? 'Diğer' : 'Other'}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'tr' ? 'İlgi Alanlarınız' : 'Your Interests'}
                  </label>
                  <textarea 
                    rows={3} 
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder={language === 'tr' ? 'Hangi konularda çalışmak istiyorsunuz?' : 'What topics are you interested in working on?'}
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                {submitStatus.message && (
                  <div className={`p-3 rounded-lg ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
                    ? (language === 'tr' ? 'Gönderiliyor...' : 'Submitting...') 
                    : (language === 'tr' ? 'Başvuruyu Gönder' : 'Submit Application')
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