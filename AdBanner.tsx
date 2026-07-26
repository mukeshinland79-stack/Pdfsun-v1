import { useState } from 'react'
import { X } from 'lucide-react'

interface AdBannerProps {
  position: 'top' | 'middle' | 'sidebar' | 'footer' | 'mobile-sticky'
}

export default function AdBanner({ position }: AdBannerProps) {
  const [closed, setClosed] = useState(false)
  if (closed) return null

  const positionClasses = {
    top: 'w-full h-[90px] mb-6',
    middle: 'w-full h-[250px] my-8',
    sidebar: 'w-[300px] h-[600px] hidden lg:block',
    footer: 'w-full h-[90px] mt-6',
    'mobile-sticky': 'fixed bottom-0 left-0 right-0 h-[60px] lg:hidden z-40',
  }

  return (
    <div className={`relative ${positionClasses[position]} bg-gray-100 dark:bg-dark-800 rounded-xl border border-dashed border-gray-300 dark:border-dark-600 flex items-center justify-center`}>
      <button
        onClick={() => setClosed(true)}
        className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
      <div className="text-center">
        <p className="text-sm text-gray-400 font-medium">Google AdSense</p>
        <p className="text-xs text-gray-300">{position.charAt(0).toUpperCase() + position.slice(1)} Banner</p>
      </div>
    </div>
  )
}
