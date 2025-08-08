import { Globe } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Smart Geo Domain Generator</h1>
        </div>
      </div>
    </header>
  )
}
