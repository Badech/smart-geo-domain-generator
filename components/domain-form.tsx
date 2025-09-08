"use client"

import { useState, useMemo } from "react"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MapPin, Globe, Settings, Hash, CheckCircle, AlertTriangle } from "lucide-react"
import { countriesData } from "@/data/cities"

interface DomainFormProps {
  onSearch: (params: {
    keywords: string[]
    country: string
    state: string
    keywordPosition: string
    extension: string
    swapWords: boolean
    minLength: number
    maxLength: number
  }) => void
  loading: boolean
}

export function DomainForm({ onSearch, loading }: DomainFormProps) {
  const [keywordInput, setKeywordInput] = useState("")
  const [country, setCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [keywordPosition, setKeywordPosition] = useState("end")
  const [extension, setExtension] = useState(".com")
  const [swapWords, setSwapWords] = useState(false)
  const [minLength, setMinLength] = useState<number>(5)
  const [maxLength, setMaxLength] = useState<number>(20)

  // Get states for selected country
  const availableStates = useMemo(() => {
    const countryData = countriesData.find((c) => c.code === country)
    return countryData?.states || []
  }, [country])

  // Get cities count for selected state
  const citiesCount = useMemo(() => {
    if (!country || !selectedState) return 0
    const countryData = countriesData.find((c) => c.code === country)
    if (!countryData) return 0
    return countryData.cities.filter((city) => city.state === selectedState).length
  }, [country, selectedState])

  // Parse keywords from input
  const parseKeywords = (input: string): string[] => {
    return input.trim() ? [input.trim()] : []
  }

  const parsedKeywords = parseKeywords(keywordInput)

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry)
    setSelectedState("") // Reset state when country changes
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedKeywords.length > 0 && country && selectedState) {
      onSearch({
        keywords: parsedKeywords,
        country,
        state: selectedState,
        keywordPosition,
        extension,
        swapWords,
        minLength,
        maxLength,
      })
    }
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 mb-8">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Geo Domain Generator - State-Focused Search
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
          Generate geo-targeted domain names for cities within a specific state with intelligent filtering.
        </CardDescription>
        <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 mt-4">
          <p className="text-blue-800 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Select a state to focus on cities within that region for more targeted results
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="keyword" className="flex items-center gap-2 text-gray-700 font-medium">
                <Search className="h-4 w-4" />
                Enter keyword
              </Label>
              <Input
                id="keyword"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="lawyer"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                required
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Hash className="h-3 w-3" />
                <span>Single keyword for faster, more accurate results</span>
              </div>
            </div>

            <div className="space-y-4">
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

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Hash className="h-4 w-4" />
                  Domain Length Filter
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="minLength" className="text-sm text-gray-600">
                      Min Length
                    </Label>
                    <Input
                      id="minLength"
                      type="number"
                      min="1"
                      max="63"
                      value={minLength}
                      onChange={(e) => setMinLength(Number(e.target.value))}
                      placeholder="5"
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLength" className="text-sm text-gray-600">
                      Max Length
                    </Label>
                    <Input
                      id="maxLength"
                      type="number"
                      min="1"
                      max="63"
                      value={maxLength}
                      onChange={(e) => setMaxLength(Number(e.target.value))}
                      placeholder="20"
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span>💡 Shorter domains are easier to remember and type</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="swap-words" checked={swapWords} onCheckedChange={setSwapWords} />
                <Label htmlFor="swap-words" className="text-gray-700">
                  Swap Words ⇄
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 font-medium">
                <MapPin className="h-4 w-4" />
                Country
              </Label>
              <Select value={country} onValueChange={handleCountryChange}>
                <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                  <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 font-medium">
                <MapPin className="h-4 w-4" />
                State/Province
              </Label>
              <Select value={selectedState} onValueChange={setSelectedState} disabled={!country}>
                <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder={country ? "Select State/Province" : "Select Country First"} />
                </SelectTrigger>
                <SelectContent>
                  {availableStates.map((state) => (
                    <SelectItem key={state.code} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedState && citiesCount > 0 && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {citiesCount} cities in {selectedState}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 text-lg shadow-lg"
            disabled={loading || parsedKeywords.length === 0 || !country || !selectedState}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Checking all domains...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Check All Domains in {selectedState || "Selected State"} ({citiesCount} cities)
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
