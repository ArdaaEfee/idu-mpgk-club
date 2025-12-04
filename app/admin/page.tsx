'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Application {
  id: number
  firstName: string
  lastName: string
  studentNumber: string
  department: string
  interests: string
  timestamp: string
  status: string
}

interface Member {
  id: number
  firstName: string
  lastName: string
  studentNumber: string
  department: string
  interests: string
  joinDate: string
  role: string
  applicationId: number
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'applications' | 'members' | 'contacts'>('applications')
  const [applications, setApplications] = useState<Application[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const roleOptions = [
    'üye',
    'başkan',
    'yardımcı başkan',
    'sekreter',
    'yazılımcı',
    'kodlamacı',
    'sponsor',
    'danışman'
  ]

  // Authentication kontrolü
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuthenticated')
    if (auth !== 'true') {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      setLoading(false)
      fetchApplications()
      fetchMembers()
      fetchContacts()
    }
  }, [router])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error('Başvurular çekme hatası:', error)
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error('Üyeler çekme hatası:', error)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      const data = await response.json()
      setContacts(data)
    } catch (error) {
      console.error('İletişim formları çekme hatası:', error)
    }
  }

  const deleteApplication = async (id: number) => {
    if (!confirm('Bu başvuruyu silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/applications?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setApplications(applications.filter(app => app.id !== id))
        alert('Başvuru silindi')
      } else {
        const result = await response.json()
        alert(`Silme işlemi başarısız: ${result.error}`)
      }
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Silme işlemi sırasında hata oluştu')
    }
  }

  const approveApplication = async (id: number, role: string = 'üye') => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, role }),
      })

      if (response.ok) {
        setApplications(applications.filter(app => app.id !== id))
        fetchMembers() // Üye listesini yenile
        alert('Başvuru onaylandı ve üye eklendi')
      } else {
        const result = await response.json()
        alert(`Onay işlemi başarısız: ${result.error}`)
      }
    } catch (error) {
      console.error('Onay hatası:', error)
      alert('Onay işlemi sırasında hata oluştu')
    }
  }

  const deleteMember = async (id: number) => {
    if (!confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/members?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setMembers(members.filter(member => member.id !== id))
        alert('Üye silindi')
      } else {
        const result = await response.json()
        alert(`Silme işlemi başarısız: ${result.error}`)
      }
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Silme işlemi sırasında hata oluştu')
    }
  }

  const updateMemberRole = async (id: number, role: string) => {
    try {
      const response = await fetch('/api/members', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, role }),
      })

      if (response.ok) {
        setMembers(members.map(member => 
          member.id === id ? { ...member, role } : member
        ))
        alert('Rol güncellendi')
      } else {
        alert('Rol güncelleme başarısız')
      }
    } catch (error) {
      console.error('Rol güncelleme hatası:', error)
      alert('Rol güncelleme sırasında hata oluştu')
    }
  }

  const deleteContact = async (id: number) => {
    if (!confirm('Bu iletişim formunu silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== id))
        alert('İletişim formu silindi')
      } else {
        const result = await response.json()
        alert(`Silme işlemi başarısız: ${result.error}`)
      }
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Silme işlemi sırasında hata oluştu')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Router zaten yönlendirecek
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yönetim Paneli</h1>
            <p className="text-gray-600 dark:text-gray-400">IDU MPGK Kulüp Yönetimi</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'applications'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('applications')}
          >
            📋 Başvurular ({applications.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'members'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('members')}
          >
            👥 Üyeler ({members.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'contacts'
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('contacts')}
          >
            📧 İletişim Formları ({contacts.length})
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Başvurular</h2>
            <div className="grid gap-6">
              {applications.map((application) => (
                <div key={application.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-yellow-400">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {application.firstName} {application.lastName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {application.studentNumber} - {application.department}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(application.timestamp).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                  
                  {application.interests && (
                    <div className="mt-3 mb-4">
                      <strong className="text-gray-900 dark:text-white">İlgi Alanları:</strong>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">{application.interests}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <select
                      id={`role-select-${application.id}`}
                      defaultValue="üye"
                      className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {roleOptions.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const select = document.getElementById(`role-select-${application.id}`) as HTMLSelectElement;
                          approveApplication(application.id, select.value);
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => deleteApplication(application.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        Reddet
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {applications.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8 py-8">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-lg">Henüz başvuru yok.</p>
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Üye Listesi</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      İsim
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Öğrenci No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Bölüm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Katılma Tarihi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.firstName} {member.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {member.studentNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {member.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={member.role}
                          onChange={(e) => updateMemberRole(member.id, e.target.value)}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {roleOptions.map(role => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(member.joinDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {members.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-lg">Henüz üye yok.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">İletişim Formları</h2>
            <div className="grid gap-6">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-purple-400">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{contact.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(contact.timestamp).toLocaleString('tr-TR')}
                      </span>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-700 dark:text-gray-300">{contact.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {contacts.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8 py-8">
                <div className="text-6xl mb-4">📧</div>
                <p className="text-lg">Henüz iletişim formu gönderilmemiş.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}