'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { DomainResult } from '@/app/page'
import { useToast } from '@/hooks/use-toast'

interface DomainResultsProps {
  results: DomainResult[]
  keyword: string // Add keyword prop to access the original keyword
}

export function DomainResults({ results, keyword }: DomainResultsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()
  const resultsPerPage = 10
  const totalPages = Math.ceil(results.length / resultsPerPage)

  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = startIndex + resultsPerPage
  const currentResults = results.slice(startIndex, endIndex)

  const copyToClipboard = (domain: string) => {
    navigator.clipboard.writeText(domain)
    toast({
      title: "Copied!",
      description: `${domain} copied to clipboard`,
    })
  }

  const getRedirectUrl = (type: string, domain: string, city: string) => {
    switch (type) {
      case 'appraisal':
        return `https://www.dynadot.com/domain/appraisal.html?domain=${domain}`
      case 'volume':
        // Search for the actual domain name in Ubersuggest
        return `https://app.neilpatel.com/en/ubersuggest/overview?keyword=${encodeURIComponent(domain)}&lang=en&locId=2840`
      case 'maps':
        // Search for city + keyword in Google Maps (with space)
        const mapsQuery = `${city} ${keyword}`
        return `https://www.google.com/maps/search/${encodeURIComponent(mapsQuery)}`
      case 'yelp':
        // Search for the domain name in Yelp
        return `https://www.yelp.com/search?find_desc=${encodeURIComponent(domain)}`
      case 'dotdb':
        return `https://dotdb.com/search?keyword=${domain}&position=any`
      case 'spam':
        return `https://check.spamhaus.org/results/?query=${domain}`
      case 'search':
        // Search for city + keyword in Google Search (with space)
        const searchQuery = `${city} ${keyword}`
        return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
      case 'archive':
        return `https://web.archive.org/web/*/${domain}`
      default:
        return '#'
    }
  }

  if (results.length === 0) {
    return null
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Domain Results ({results.length} found)
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Actual page: {currentPage}</span>
            {totalPages > 1 && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">DOMAIN</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">POPULATION</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">STATE</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">AVAILABILITY</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">TOOLS</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result, index) => {
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">📁</span>
                        </div>
                        <span className="font-medium text-gray-800">{result.domain}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.domain)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {result.population.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {result.state}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          className="bg-sky-500 hover:bg-sky-600 text-white text-xs px-2 py-1 h-7"
                          onClick={() => window.open(getRedirectUrl('appraisal', result.domain, result.city), '_blank')}
                        >
                          ⭐ Appraisal
                        </Button>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 h-7"
                          onClick={() => window.open(getRedirectUrl('volume', result.domain, result.city), '_blank')}
                        >
                          📊 Volume
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-2 py-1 h-7"
                          onClick={() => window.open(getRedirectUrl('maps', result.domain, result.city), '_blank')}
                        >
                          👥 Clients (Google Maps)
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 h-7"
                          onClick={() => window.open(getRedirectUrl('yelp', result.domain, result.city), '_blank')}
                        >
                          🔍 Clients (Yelp)
                        </Button>
                        <Button
                          size="sm"
                          className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs px-2 py-1 h-7"
                          onClick={() => window.open(getRedirectUrl('dotdb', result.domain, result.city), '_blank')}
                        >
                          📈 dotDB
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 h-7"
                          onClick={() => window.open(getRedirectUrl('search', result.domain, result.city), '_blank')}
                        >
                          🔍 Search
                        </Button>
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 h-7"
                          onClick={() => window.open(getRedirectUrl('spam', result.domain, result.city), '_blank')}
                        >
                          ⚠️ Spam
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1 h-7"
                          onClick={() => window.open(getRedirectUrl('archive', result.domain, result.city), '_blank')}
                        >
                          📚 Archive
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
