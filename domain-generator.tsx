"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Globe, MapPin, Hash, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { countriesData } from "./data/cities"
import { useDomainGenerator } from "./hooks/useDomainGenerator"
import { copyToClipboard, exportToCsv } from "./utils/domainGenerator"

export default function DomainGenerator() {
  const {
    keywords,
    setKeywords,
    selectedCountry,
    setSelectedCountry,
    cityPosition,
    setCityPosition,
    tld,
    setTld,
    allDomains,
    paginatedDomains,
    currentPage,
    setCurrentPage,
    totalPages,
    isGenerating,
    generateAsync,
    stats,
  } = useDomainGenerator()

  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopyAll = async () => {
    copyToClipboard(allDomains)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleExportCsv = () => {
    exportToCsv(allDomains)
  }

  const handleGenerate = async () => {
    await generateAsync()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Smart Geo Domain Generator</h1>
          <p className="text-lg text-gray-600">Generate geo-targeted domain names at scale with bulk keywords</p>
        </div>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Configuration
            </CardTitle>
            <CardDescription>Set up your keywords, location, and domain preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Keywords Input */}
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (one per line or comma-separated)</Label>
                <Textarea
                  id="keywords"
                  placeholder="lawyer&#10;attorney&#10;legal&#10;law firm&#10;consultant"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="min-h-[140px] resize-none font-mono text-sm"
                />
                <p className="text-sm text-gray-500">
                  {stats.keywordCount} keyword{stats.keywordCount !== 1 ? "s" : ""} entered
                </p>
              </div>

              {/* Configuration Options */}
              <div className="space-y-4">
                {/* Country Selection */}
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select
                    value={selectedCountry?.code || ""}
                    onValueChange={(code) => {
                      const country = countriesData.find((c) => c.code === code)
                      setSelectedCountry(country || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countriesData.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCountry && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {stats.cityCount} cities loaded
                    </p>
                  )}
                </div>

                {/* City Position */}
                <div className="space-y-2">
                  <Label>City Position</Label>
                  <Select value={cityPosition} onValueChange={(value: "start" | "end") => setCityPosition(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start">Start (CityKeyword.com)</SelectItem>
                      <SelectItem value="end">End (KeywordCity.com)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* TLD Selection */}
                <div className="space-y-2">
                  <Label>Top Level Domain</Label>
                  <Select value={tld} onValueChange={setTld}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="com">.com</SelectItem>
                      <SelectItem value="net">.net</SelectItem>
                      <SelectItem value="org">.org</SelectItem>
                      <SelectItem value="io">.io</SelectItem>
                      <SelectItem value="co">.co</SelectItem>
                      <SelectItem value="us">.us</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleGenerate}
                disabled={stats.keywordCount === 0 || stats.cityCount === 0 || isGenerating}
                size="lg"
                className="px-8"
              >
                {isGenerating ? "Generating..." : `Generate ${stats.domainCount.toLocaleString()} Domains`}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {allDomains.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Generated Domains
                  </CardTitle>
                  <CardDescription>{allDomains.length.toLocaleString()} domain combinations generated</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCsv}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAll}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                    {copySuccess ? "Copied!" : "Copy All"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Stats */}
              <div className="flex gap-4 mb-4">
                <Badge variant="secondary">{stats.keywordCount} Keywords</Badge>
                <Badge variant="secondary">{stats.cityCount} Cities</Badge>
                <Badge variant="default">{stats.domainCount.toLocaleString()} Domains</Badge>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * 50 + 1} to {Math.min(currentPage * 50, allDomains.length)} of{" "}
                    {allDomains.length.toLocaleString()} domains
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Domain List */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                    <div className="col-span-5">Domain</div>
                    <div className="col-span-2">Keyword</div>
                    <div className="col-span-3">City</div>
                    <div className="col-span-2">Population</div>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {paginatedDomains.map((domain, index) => (
                    <div
                      key={`${domain.domain}-${index}`}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 text-sm"
                    >
                      <div className="col-span-5 font-mono text-blue-600 break-all">{domain.domain}</div>
                      <div className="col-span-2 text-gray-600">{domain.keyword}</div>
                      <div className="col-span-3 text-gray-600">
                        {domain.city}, {domain.state}
                      </div>
                      <div className="col-span-2 text-gray-500">
                        {domain.population ? domain.population.toLocaleString() : "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Examples */}
        {selectedCountry && stats.keywordCount > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview Examples</CardTitle>
              <CardDescription>Sample domains based on your current settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">City at Start:</h4>
                  <div className="space-y-1 text-sm font-mono text-gray-600">
                    {selectedCountry.cities.slice(0, 3).map((city, i) => (
                      <div key={i}>
                        {city.name.toLowerCase().replace(/[^a-z0-9]/g, "")}
                        {keywords
                          .split(/[,\n]/)[0]
                          ?.trim()
                          .replace(/[^a-z0-9]/g, "") || "keyword"}
                        .{tld}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">City at End:</h4>
                  <div className="space-y-1 text-sm font-mono text-gray-600">
                    {selectedCountry.cities.slice(0, 3).map((city, i) => (
                      <div key={i}>
                        {keywords
                          .split(/[,\n]/)[0]
                          ?.trim()
                          .replace(/[^a-z0-9]/g, "") || "keyword"}
                        {city.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.{tld}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
