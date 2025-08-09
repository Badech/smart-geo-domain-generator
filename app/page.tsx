"use client"

import { useState } from "react"
import { DomainForm } from "@/components/domain-form"
import { DomainResults } from "@/components/domain-results"
import { Header } from "@/components/header"
import { domainChecker } from "@/lib/advanced-domain-checker"
import { checkTrademarkConflict } from "@/lib/domain-checker"
import { countriesData } from "@/data/cities"
import DomainGenerator from "../domain-generator"

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
      // Generate potential domains for all keywords × cities combinations
      const potentialDomains = generateDomainCombinations(searchParams)

      // Check availability for each domain
      const checkedResults: DomainResult[] = []

      // Process domains in batches to avoid overwhelming APIs
      const batchSize = 5
      for (let i = 0; i < potentialDomains.length; i += batchSize) {
        const batch = potentialDomains.slice(i, i + batchSize)

        const batchPromises = batch.map(async (domainData) => {
          const isAvailable = await domainChecker.checkAvailability(domainData.domain)
          const hasTrademarkIssue = await checkTrademarkConflict(domainData.keyword || "")

          if (isAvailable && !hasTrademarkIssue) {
            return {
              ...domainData,
              available: true,
              trademark: false,
            }
          }
          return null
        })

        const batchResults = await Promise.all(batchPromises)
        checkedResults.push(...batchResults.filter((result) => result !== null))

        // Small delay between batches
        if (i + batchSize < potentialDomains.length) {
          await new Promise((resolve) => setTimeout(resolve, 300))
        }
      }

      // Sort by population (highest first) to show most important cities first
      checkedResults.sort((a, b) => b.population - a.population)

      setResults(checkedResults)
    } catch (error) {
      console.error("Error checking domains:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Generate multiple domain combinations for all keywords × cities
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

    // Generate domains for each keyword × city combination
    searchParams.keywords.forEach((keyword) => {
      cities.forEach((cityData) => {
        const cleanCity = cityData.name.replace(/\s+/g, "") // Remove all spaces from city name
        const cleanKeyword = keyword.replace(/\s+/g, "") // Remove spaces from keyword
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
          keyword: keyword, // Store the original keyword
          city: cityData.name, // Keep original city name for display
          state: cityData.state,
          population: cityData.population || getPopulationForCity(cityData.name),
        })
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
        <DomainGenerator />
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
