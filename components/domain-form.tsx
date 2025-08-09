"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MapPin, Globe, Settings, Hash } from "lucide-react"

interface DomainFormProps {
  onSearch: (params: {
    keywords: string[]
    country: string
    city: string
    keywordPosition: string
    extension: string
    swapWords: boolean
  }) => void
  loading: boolean
}

export function DomainForm({ onSearch, loading }: DomainFormProps) {
  const [keywordInput, setKeywordInput] = useState("")
  const [country, setCountry] = useState("")
  const [keywordPosition, setKeywordPosition] = useState("end")
  const [extension, setExtension] = useState(".com")
  const [swapWords, setSwapWords] = useState(false)

  // Parse keywords from input (comma-separated or line-separated)
  const parseKeywords = (input: string): string[] => {
    return input
      .split(/[,\n]/)
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0)
  }

  const parsedKeywords = parseKeywords(keywordInput)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedKeywords.length > 0 && country) {
      onSearch({
        keywords: parsedKeywords,
        country,
        city: "", // Pass empty string since we're not selecting a specific city
        keywordPosition,
        extension,
        swapWords,
      })
    }
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 mb-8">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Geo Domain Generator - Bulk Keywords
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
          Generate geo-targeted domain names for multiple keywords across all major cities in USA or Canada. Get
          availability status, population data, and useful tools for each domain suggestion.
        </CardDescription>
        <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 mt-4">
          <p className="text-orange-800 text-sm">
            💡 Enter multiple keywords separated by commas or new lines to generate domains for all combinations
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="keywords" className="flex items-center gap-2 text-gray-700 font-medium">
                <Search className="h-4 w-4" />
                Enter keywords (comma or line separated)
              </Label>
              <Textarea
                id="keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="lawyer&#10;attorney&#10;legal services&#10;law firm"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 min-h-[120px] resize-none font-mono text-sm"
                required
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Hash className="h-3 w-3" />
                <span>
                  {parsedKeywords.length} keyword{parsedKeywords.length !== 1 ? "s" : ""} entered
                </span>
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

              <div className="flex items-center space-x-2">
                <Switch id="swap-words" checked={swapWords} onCheckedChange={setSwapWords} />
                <Label htmlFor="swap-words" className="text-gray-700">
                  Swap Words ⇄
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 font-medium">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">🇺🇸 USA</SelectItem>
                <SelectItem value="CA">🇨🇦 Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 text-lg shadow-lg"
            disabled={loading || parsedKeywords.length === 0 || !country}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Checking domain availability...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Generate {parsedKeywords.length} × Cities Domains
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
