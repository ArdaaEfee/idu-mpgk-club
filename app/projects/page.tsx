'use client'
import ProjectCard from '../components/ProjectCard'
import Footer from '../components/Footer'
import { useLanguage } from '../contexts/LanguageContext'

export default function ProjectsPage() {
  const { t, language } = useLanguage()

    const projects = [
  {
    title: "KUZGUN - Yenilikçi SİHA Teknolojisi",
    description: "KUZGUN, ileri seviye mühendislik çözümleriyle geliştirilmiş, yüksek manevra kabiliyetine sahip yerli ve yenilikçi bir SİHA prototipidir. En dikkat çekici özelliği, uçuş sırasında belirli bir dereceye kadar açılıp kapanabilen kanat mekanizması sayesinde farklı görev profillerine uyum sağlayabilmesidir. Bu sayede hem yüksek hızda stabil uçuş hem de dar alanlarda kontrollü manevra imkânı sunar. KUZGUN’un gövde yapısı hafiflik ve dayanıklılık esas alınarak tasarlanmıştır. Otonom uçuş yetenekleri sayesinde görevini minimum insan müdahalesiyle yerine getirebilir. Modüler tasarımı, farklı sensör ve görev yüklerinin kolayca entegre edilebilmesine olanak tanır.",
    image: "/projects/kuzgun.png", // Gerçek fotoğraf
    technologies: ["Mikrodenetleyici tabanlı uçuş kontrol sistemi", "Değişken geometrili kanat (mekanik kanat açılma-kapanma sistemi)", "GPS destekli otonom navigasyon","PID tabanlı stabilizasyon algoritmaları", "Gerçek zamanlı telemetri ve yer istasyonu haberleşmesi"],
    category: t('SİHA')
  },
{
    title: "KAPLAN - Yerli İnsansız Kara Aracı",
    description: "KAPLAN, yüksek hız, çeviklik ve görev sürekliliği esas alınarak geliştirilmiş yerli bir İnsansız Kara Aracı (İKA) prototipidir. Zorlu arazi koşullarında kesintisiz hareket edebilmesi için güçlü motor yapısı ve optimize edilmiş süspansiyon sistemine sahiptir. Modüler gövde tasarımı sayesinde farklı görev yükleri kolaylıkla entegre edilebilir. KAPLAN, uzaktan kontrol edilebildiği gibi yarı otonom sürüş modlarıyla da görev yapabilmektedir. Üzerinde bulunan sensörler sayesinde çevresini algılayarak güvenli ilerleme sağlar. Dayanıklı şasi yapısı, darbelere ve dış etkenlere karşı yüksek koruma sunar. Görev esnekliği ve arazi kabiliyetiyle KAPLAN, modern savunma teknolojilerine güçlü bir alternatif olarak öne çıkmaktadır.",
    image: "/projects/kaplan.png", // Gerçek fotoğraf
    technologies: ["Mikrodenetleyici tabanlı motor sürücü ve hareket kontrol sistemi", "Uzaktan kumanda ve RF haberleşme teknolojisi", "Ultrasonik / mesafe sensörleriyle çevre algılama", "Yarı otonom sürüş algoritmaları","Gerçek zamanlı telemetri sistemi"],
    category: t('İKA')
  }
]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold text-center mb-8">{t('projects_title')}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}