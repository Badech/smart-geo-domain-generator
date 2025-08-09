"use client"

import { useState } from "react"
import { DomainForm } from "@/components/domain-form"
import { DomainResults } from "@/components/domain-results"
import { Header } from "@/components/header"
import { countriesData } from "@/data/cities"

export interface DomainResult {
  domain: string
  keyword?: string
  city: string
  state: string
  population: number
  available: boolean
  trademark: boolean
}

export default function Home() {
  const [results, setResults] = useState<DomainResult[]>([])
  const [loading, setLoading] = useState(false)
  const [currentKeywords, setCurrentKeywords] = useState<string[]>([])

  // Simple domain availability check
  const checkDomainAvailability = async (domain: string): Promise<boolean> => {
    try {
      // Try to fetch the domain - if it responds, it's likely taken
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      const response = await fetch(`https://${domain}`, {
        method: "HEAD",
        signal: controller.signal,
        mode: "no-cors",
      })

      clearTimeout(timeoutId)

      // If we get any response, domain is likely taken
      return false
    } catch (error) {
      // If request fails (CORS, timeout, etc.), domain might be available
      return true
    }
  }

  const handleSearch = async (searchParams: {
    keywords: string[]
    country: string
    city: string
    keywordPosition: string
    extension: string
    swapWords: boolean
  }) => {
    setLoading(true)
    setCurrentKeywords(searchParams.keywords)

    try {
      // Generate potential domains for single keyword × cities combinations
      const potentialDomains = generateDomainCombinations(searchParams)

      // Check availability for each domain and only keep available ones
      const availableResults: DomainResult[] = []

      // Process domains in smaller batches to avoid overwhelming the browser
      const batchSize = 20 // Increased batch size since we have fewer domains
      for (let i = 0; i < potentialDomains.length; i += batchSize) {
        const batch = potentialDomains.slice(i, i + batchSize)

        const batchPromises = batch.map(async (domainData) => {
          const isAvailable = await checkDomainAvailability(domainData.domain)

          if (isAvailable) {
            return {
              ...domainData,
              available: true,
              trademark: false,
            }
          }
          return null
        })

        const batchResults = await Promise.all(batchPromises)
        const availableDomains = batchResults.filter((result) => result !== null)
        availableResults.push(...availableDomains)

        // Smaller delay since we have fewer domains to check
        if (i + batchSize < potentialDomains.length) {
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }

      // Sort by population (highest first) to show most important cities first
      availableResults.sort((a, b) => b.population - a.population)

      setResults(availableResults)
    } catch (error) {
      console.error("Error checking domains:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const generateDomainCombinations = (searchParams: {
    keywords: string[]
    country: string
    city: string
    keywordPosition: string
    extension: string
    swapWords: boolean
  }) => {
    const domains: Omit<DomainResult, "available" | "trademark">[] = []

    // Get all cities for the selected country
    const countryData = countriesData.find((country) => country.code === searchParams.country)
    const cities = countryData ? countryData.cities : []

    // Use only the first keyword (single keyword mode)
    const keyword = searchParams.keywords[0]
    if (!keyword) return domains

    cities.forEach((cityData) => {
      const cleanCity = cityData.name.replace(/[^a-zA-Z0-9]/g, "")
      const cleanKeyword = keyword.replace(/[^a-zA-Z0-9]/g, "")
      let domainName = ""

      if (searchParams.keywordPosition === "beginning") {
        domainName = searchParams.swapWords
          ? `${cleanCity}${cleanKeyword}${searchParams.extension}`
          : `${cleanKeyword}${cleanCity}${searchParams.extension}`
      } else {
        domainName = searchParams.swapWords
          ? `${cleanKeyword}${cleanCity}${searchParams.extension}`
          : `${cleanCity}${cleanKeyword}${searchParams.extension}`
      }

      domains.push({
        domain: domainName.toLowerCase(),
        keyword: keyword,
        city: cityData.name,
        state: cityData.state,
        population: cityData.population || getPopulationForCity(cityData.name),
      })
    })

    return domains
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <DomainForm onSearch={handleSearch} loading={loading} />
        {results.length > 0 && <DomainResults results={results} keywords={currentKeywords} />}
      </main>
    </div>
  )
}

function getPopulationForCity(city: string): number {
  const cityPopulationMap: Record<string, number> = {
    "New York": 8177025,
    "Los Angeles": 3985516,
    Chicago: 2671635,
    Houston: 2325353,
    Phoenix: 1759943,
    Philadelphia: 1585480,
    "San Antonio": 1598964,
    "San Diego": 1429653,
    Dallas: 1348886,
    Austin: 1028225,
    Toronto: 2930000,
    Vancouver: 675218,
    Montreal: 1780000,
    Calgary: 1336000,
    Birmingham: 200733,
    Huntsville: 215006,
    Mobile: 187041,
    Montgomery: 200603,
    Tuscaloosa: 101129,
    Anchorage: 291247,
    Fairbanks: 32515,
    Juneau: 32255,
  }
  return cityPopulationMap[city] || 50000
}
