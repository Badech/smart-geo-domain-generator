"use client"

import { useState } from "react"
import { DomainForm } from "@/components/domain-form"
import { DomainResults } from "@/components/domain-results"
import { Header } from "@/components/header"
import { domainChecker } from "@/lib/advanced-domain-checker"
import { checkTrademarkConflict } from "@/lib/domain-checker"
import { countryCityData } from "@/data/cities"

export interface DomainResult {
  domain: string
  city: string
  state: string
  population: number
  available: boolean
  trademark: boolean
}

export default function Home() {
  const [results, setResults] = useState<DomainResult[]>([])
  const [loading, setLoading] = useState(false)
  const [currentKeyword, setCurrentKeyword] = useState("")

  const handleSearch = async (searchParams: {
    keyword: string
    country: string
    city: string
    keywordPosition: string
    extension: string
    swapWords: boolean
  }) => {
    setLoading(true)
    setCurrentKeyword(searchParams.keyword)

    try {
      // Generate potential domains for all cities in the country
      const potentialDomains = generateDomainCombinations(searchParams)

      // Check availability for each domain
      const checkedResults: DomainResult[] = []

      // Process domains in batches to avoid overwhelming APIs
      const batchSize = 5
      for (let i = 0; i < potentialDomains.length; i += batchSize) {
        const batch = potentialDomains.slice(i, i + batchSize)

        const batchPromises = batch.map(async (domainData) => {
          const isAvailable = await domainChecker.checkAvailability(domainData.domain)
          const hasTrademarkIssue = await checkTrademarkConflict(searchParams.keyword)

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

  // Generate multiple domain combinations for all cities in the selected country
  const generateDomainCombinations = (searchParams: {
    keyword: string
    country: string
    city: string
    keywordPosition: string
    extension: string
    swapWords: boolean
  }) => {
    const domains: Omit<DomainResult, "available" | "trademark">[] = []

    // Get all cities for the selected country
    const cities = countryCityData[searchParams.country] || []

    cities.forEach((city) => {
      const cleanCity = city.replace(/\s+/g, "") // Remove all spaces from city name
      let domainName = ""

      if (searchParams.keywordPosition === "beginning") {
        domainName = searchParams.swapWords
          ? `${cleanCity}${searchParams.keyword}${searchParams.extension}`
          : `${searchParams.keyword}${cleanCity}${searchParams.extension}`
      } else {
        domainName = searchParams.swapWords
          ? `${searchParams.keyword}${cleanCity}${searchParams.extension}`
          : `${cleanCity}${searchParams.keyword}${searchParams.extension}`
      }

      domains.push({
        domain: domainName.toLowerCase(),
        city: city, // Keep original city name for display
        state: getStateForCity(city),
        population: getPopulationForCity(city),
      })
    })

    return domains
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <DomainForm onSearch={handleSearch} loading={loading} />
        {results.length > 0 && <DomainResults results={results} keyword={currentKeyword} />}
      </main>
    </div>
  )
}

function getStateForCity(city: string): string {
  const cityStateMap: Record<string, string> = {
    "New York": "New York",
    "Los Angeles": "California",
    Chicago: "Illinois",
    Houston: "Texas",
    Phoenix: "Arizona",
    Philadelphia: "Pennsylvania",
    "San Antonio": "Texas",
    "San Diego": "California",
    Dallas: "Texas",
    Austin: "Texas",
    Toronto: "Ontario",
    Vancouver: "British Columbia",
    Montreal: "Quebec",
    Calgary: "Alberta",
  }
  return cityStateMap[city] || "Unknown"
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
  }
  return cityPopulationMap[city] || 500000
}
