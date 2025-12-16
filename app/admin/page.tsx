'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Interface Tanımları
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

// Fikirler için Interface (MongoDB _id kullandığı için string)
interface Idea {
  _id: string
  name: string
  email: string
  projectTitle: string
  description: string
  fileLink?: string
  timestamp: string
}

export default function AdminPage() {
  // Tab seçeneklerine 'ideas' eklendi
  const [activeTab, setActiveTab] = useState<'applications' | 'members' | 'contacts' | 'ideas'>('applications')
  
  const [applications, setApplications] = useState<Application[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [ideas, setIdeas] = useState<Idea[]>([]) // Fikirler state'i
  
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const roleOptions = ['üye', 'başkan', 'yardımcı başkan', 'sekreter', 'yazılımcı', 'kodlamacı', 'sponsor', 'danışman']

  // Auth Kontrolü
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
      fetchIdeas() // Fikirleri çek
    }
  }, [router])

  // --- FETCH FONKSİYONLARI ---
  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications')
      setApplications(await res.json())
    } catch (e) { console.error(e) }
  }

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members')
      setMembers(await res.json())
    } catch (e) { console.error(e) }
  }

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts')
      setContacts(await res.json())
    } catch (e) { console.error(e) }
  }

  const fetchIdeas = async () => {
    try {
      const res = await fetch('/api/ideas')
      const data = await res.json()
      if (data.ideas) setIdeas(data.ideas)
    } catch (e) { console.error(e) }
  }

  // --- SİLME VE GÜNCELLEME İŞLEMLERİ ---
  
  // Başvuru Sil
  const deleteApplication = async (id: number) => {
    if (!confirm('Silmek istediğine emin misin?')) return
    const res = await fetch(`/api/applications?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setApplications(applications.filter(app => app.id !== id))
      alert('Silindi')
    }
  }

  // Başvuru Onayla
  const approveApplication = async (id: number, role: string = 'üye') => {
    const res = await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    })
    if (res.ok) {
      setApplications(applications.filter(app => app.id !== id))
      fetchMembers()
      alert('Onaylandı')
    }
  }

  // Üye Sil
  const deleteMember = async (id: number) => {
    if (!confirm('Silmek istediğine emin misin?')) return
    const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMembers(members.filter(m => m.id !== id))
      alert('Silindi')
    }
  }

  // Üye Rol Güncelle
  const updateMemberRole = async (id: number, role: string) => {
    const res = await fetch('/api/members', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    })
    if (res.ok) {
      setMembers(members.map(m => m.id === id ? { ...m, role } : m))
      alert('Rol güncellendi')
    }
  }

  // İletişim Formu Sil
  const deleteContact = async (id: number) => {
    if (!confirm('Silmek istediğine emin misin?')) return
    const res = await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setContacts(contacts.filter(c => c.id !== id))
      alert('Silindi')
    }
  }

  // Fikir Sil (YENİ)
  const deleteIdea = async (id: string) => {
    if (!confirm('Bu proje fikrini silmek istediğine emin misin?')) return
    const res = await fetch(`/api/ideas?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setIdeas(ideas.filter(i => i._id !== id))
      alert('Fikir silindi')
    } else {
      alert('Silinemedi')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated')
    router.push('/admin/login')
  }

  // GÜVENLİ LİNK KONTROLÜ
  const isTrustedLink = (url: string) => {
    const trustedDomains = ['drive.google.com', 'github.com', 'wetransfer.com', 'linkedin.com', 'docs.google.com']
    return trustedDomains.some(domain => url.includes(domain))
  }

  if (loading) return <div className="min-h-screen flex justify-center items-center">Yükleniyor...</div>
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yönetim Paneli</h1>
            <p className="text-gray-600 dark:text-gray-400">IDU MPGK Kulüp Yönetimi</p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            Çıkış Yap
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6 gap-2">
          {[
            { id: 'applications', label: `📋 Başvurular (${applications.length})`, color: 'blue' },
            { id: 'members', label: `👥 Üyeler (${members.length})`, color: 'green' },
            { id: 'ideas', label: `🚀 Fikir Kutusu (${ideas.length})`, color: 'orange' }, // YENİ TAB
            { id: 'contacts', label: `📧 İletişim (${contacts.length})`, color: 'purple' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors rounded-t-lg ${
                activeTab === tab.id
                  ? `bg-white dark:bg-gray-800 border-b-2 border-${tab.color}-500 text-${tab.color}-600 dark:text-${tab.color}-400 shadow-sm`
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- BAŞVURULAR TAB --- */}
        {activeTab === 'applications' && (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-400">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{app.firstName} {app.lastName}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{app.studentNumber} - {app.department}</p>
                    {app.interests && <p className="mt-2 text-gray-700 dark:text-gray-300"><strong>İlgi:</strong> {app.interests}</p>}
                  </div>
                  <div className="text-sm text-gray-500">{new Date(app.timestamp).toLocaleDateString('tr-TR')}</div>
                </div>
                <div className="mt-4 flex gap-2 items-center">
                  <select id={`role-${app.id}`} defaultValue="üye" className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white">
                    {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <button onClick={() => approveApplication(app.id, (document.getElementById(`role-${app.id}`) as HTMLSelectElement).value)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Onayla</button>
                  <button onClick={() => deleteApplication(app.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Reddet</button>
                </div>
              </div>
            ))}
            {applications.length === 0 && <p className="text-center text-gray-500 mt-10">Henüz başvuru yok.</p>}
          </div>
        )}

        {/* --- ÜYELER TAB --- */}
        {activeTab === 'members' && (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="p-4">İsim</th>
                  <th className="p-4">Bölüm</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="p-4">{m.firstName} {m.lastName} <br/><span className="text-xs text-gray-500">{m.studentNumber}</span></td>
                    <td className="p-4">{m.department}</td>
                    <td className="p-4">
                      <select value={m.role} onChange={(e) => updateMemberRole(m.id, e.target.value)} className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white">
                        {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="p-4"><button onClick={() => deleteMember(m.id)} className="text-red-500 hover:underline">Sil</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {members.length === 0 && <p className="text-center p-8 text-gray-500">Henüz üye yok.</p>}
          </div>
        )}

        {/* --- YENİ EKLENEN: FİKİR KUTUSU TAB --- */}
        {activeTab === 'ideas' && (
          <div className="grid gap-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Gelen Proje Fikirleri</h2>
            {ideas.map((idea) => (
              <div key={idea._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-orange-400 relative">
                
                {/* Silme Butonu */}
                <button 
                  onClick={() => deleteIdea(idea._id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                  title="Bu fikri sil"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>

                <div className="flex flex-col md:flex-row justify-between mb-4 pr-10">
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{idea.projectTitle}</h3>
                    <p className="text-sm text-gray-500">Gönderen: <span className="text-gray-800 dark:text-gray-200 font-medium">{idea.name}</span> ({idea.email})</p>
                  </div>
                  <div className="text-sm text-gray-400 mt-2 md:mt-0">
                    {new Date(idea.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-md mb-4 text-gray-700 dark:text-gray-300">
                  {idea.description}
                </div>

                {/* GÜVENLİ LİNK ALANI */}
                {idea.fileLink ? (
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-500 mr-2">Dosya Linki:</span>
                    {isTrustedLink(idea.fileLink) ? (
                      <a href={idea.fileLink} target="_blank" rel="noopener noreferrer" 
                         className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 text-sm font-medium transition">
                        ✅ Güvenli Bağlantı (Aç)
                      </a>
                    ) : (
                      <a href={idea.fileLink} target="_blank" rel="noopener noreferrer" 
                         className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium transition"
                         onClick={(e) => { if(!confirm('Bu link tanınmayan bir siteden (Drive/Github değil). Açmak istediğine emin misin?')) e.preventDefault() }}
                      >
                        ⚠️ Dikkatli Aç (Bilinmeyen Site)
                      </a>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">Dosya eklenmemiş.</span>
                )}
              </div>
            ))}
            {ideas.length === 0 && <p className="text-center text-gray-500 mt-10">Henüz fikir kutusuna bir şey atılmamış.</p>}
          </div>
        )}

        {/* --- İLETİŞİM TAB --- */}
        {activeTab === 'contacts' && (
          <div className="grid gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-purple-400 relative">
                <button onClick={() => deleteContact(contact.id)} className="absolute top-4 right-4 text-red-500 hover:underline text-sm">Sil</button>
                <h3 className="font-bold text-gray-900 dark:text-white">{contact.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{contact.email}</p>
                <p className="text-gray-700 dark:text-gray-300">{contact.message}</p>
                <span className="text-xs text-gray-400 mt-2 block">{new Date(contact.timestamp).toLocaleString('tr-TR')}</span>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-center text-gray-500 mt-10">İletişim formu boş.</p>}
          </div>
        )}

      </div>
    </div>
  )
}