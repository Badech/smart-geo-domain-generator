'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, MapPin, Globe, Settings } from 'lucide-react'
import { countryCityData } from '@/data/cities'

interface DomainFormProps {
  onSearch: (params: {
    keyword: string
    country: string
    city: string
    keywordPosition: string
    extension: string
    swapWords: boolean
  }) => void
  loading: boolean
}

export function DomainForm({ onSearch, loading }: DomainFormProps) {
  const [keyword, setKeyword] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [keywordPosition, setKeywordPosition] = useState('end')
  const [extension, setExtension] = useState('.com')
  const [swapWords, setSwapWords] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword && country && city) {
      onSearch({
        keyword,
        country,
        city,
        keywordPosition,
        extension,
        swapWords
      })
    }
  }

  const availableCities = country ? countryCityData[country] || [] : []

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 mb-8">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Geo Domain Random Domain Name Generator
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
          GEO Domain Names Generator will help you generate domains for a specific keyword in all cities sorted by population, 
          it provides also CPC and appraisal for the domains.
        </CardDescription>
        <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 mt-4">
          <p className="text-orange-800 text-sm">
            💡 Do you want us to add a feature to the website: <a href="#" className="text-orange-600 underline">Let us know</a>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="keyword" className="flex items-center gap-2 text-gray-700 font-medium">
                <Search className="h-4 w-4" />
                Enter a keyword
              </Label>
              <Input
                id="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Lawyer"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 font-medium">
                <Settings className="h-4 w-4" />
                Keyword Position
              </Label>
              <Select value={keywordPosition} onValueChange={setKeywordPosition}>
                <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginning">At the beginning</SelectItem>
                  <SelectItem value="end">At the end</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 font-medium">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={country} onValueChange={(value) => {
                setCountry(value)
                setCity('') // Reset city when country changes
              }}>
                <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">🇺🇸 USA</SelectItem>
                  <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={city} onValueChange={setCity} disabled={!country}>
                <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((cityName) => (
                    <SelectItem key={cityName} value={cityName}>
                      {cityName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 font-medium">
              <Globe className="h-4 w-4" />
              Extensions
            </Label>
            <Select value={extension} onValueChange={setExtension}>
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=".com">.com</SelectItem>
                <SelectItem value=".net">.net</SelectItem>
                <SelectItem value=".org">.org</SelectItem>
                <SelectItem value=".io">.io</SelectItem>
                <SelectItem value=".co">.co</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="swap-words"
              checked={swapWords}
              onCheckedChange={setSwapWords}
            />
            <Label htmlFor="swap-words" className="text-gray-700">
              Swap Words ⇄
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 text-lg shadow-lg"
            disabled={loading || !keyword || !country || !city}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Checking domain availability...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
