'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProjectModal from './ProjectModal'

interface ProjectCardProps {
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
}

export default function ProjectCard({ 
  title, 
  description, 
  image, 
  technologies, 
  category
}: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Kart - Tıklanabilir */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsModalOpen(true)
          }
        }}
      >
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-4 right-4">
            <span className="bg-idu-blue text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">
            {title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.slice(0, 3).map((tech, index) => (
              <span 
                key={index} 
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs">
                +{technologies.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-idu-blue dark:text-blue-400 font-medium text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition">
              Detayları Görüntüle →
            </span>
            <div className="text-gray-400 group-hover:text-idu-blue transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ProjectModal
        project={{
          title,
          description,
          image,
          technologies,
          category
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}