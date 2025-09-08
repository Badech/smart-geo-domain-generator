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

  // Realistic domain availability simulation
  const isLikelyAvailable = (domain: string, city: string, population: number): boolean => {
    const domainLower = domain.toLowerCase()

    // Filter out domains that are very likely to be taken
    const veryLikelyTaken = [
      // Major cities with common keywords are usually taken
      "newyork",
      "losangeles",
      "chicago",
      "houston",
      "phoenix",
      "philadelphia",
      "sanantonio",
      "sandiego",
      "dallas",
      "austin",
      "toronto",
      "vancouver",
      "montreal",
      "calgary",
    ]

    // Common business keywords that are likely taken in major cities
    const commonKeywords = [
      "lawyer",
      "attorney",
      "doctor",
      "dentist",
      "restaurant",
      "hotel",
      "realtor",
      "realestate",
      "insurance",
      "auto",
      "car",
      "pizza",
      "plumber",
      "electrician",
      "contractor",
      "business",
    ]

    // Check if domain contains very common combinations
    for (const city of veryLikelyTaken) {
      for (const keyword of commonKeywords) {
        if (domainLower.includes(city + keyword) || domainLower.includes(keyword + city)) {
          return false // Very likely taken
        }
      }
    }

    // Filter based on population - higher population cities more likely taken
    if (population > 1000000) {
      // Major cities - only 20% likely available
      return Math.random() < 0.2
    } else if (population > 500000) {
      // Large cities - 40% likely available
      return Math.random() < 0.4
    } else if (population > 100000) {
      // Medium cities - 60% likely available
      return Math.random() < 0.6
    } else {
      // Smaller cities - 80% likely available
      return Math.random() < 0.8
    }
  }

  const handleSearch = async (searchParams: {
    keywords: string[]
    country: string
    state: string
    keywordPosition: string
    extension: string
    swapWords: boolean
    minLength: number
    maxLength: number
  }) => {
    setLoading(true)
    setCurrentKeywords(searchParams.keywords)

    try {
      // Generate potential domains
      const potentialDomains = generateDomainCombinations(searchParams)
      console.log(`Generated ${potentialDomains.length} potential domains for ${searchParams.state}`)

      // Filter by domain length
      const lengthFilteredDomains = potentialDomains.filter((domain) => {
        const domainLength = domain.domain.length
        return domainLength >= searchParams.minLength && domainLength <= searchParams.maxLength
      })

      console.log(
        `${lengthFilteredDomains.length} domains match length criteria (${searchParams.minLength}-${searchParams.maxLength} chars)`,
      )

      // Simulate checking with a delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check availability for ALL domains (don't filter out taken ones)
      const allResults: DomainResult[] = lengthFilteredDomains.map((domain) => ({
        ...domain,
        available: isLikelyAvailable(domain.domain, domain.city, domain.population),
        trademark: false,
      }))

      console.log(`Checked availability for all ${allResults.length} domains`)

      // Sort by population (highest first) to show most important cities first
      allResults.sort((a, b) => b.population - a.population)

      setResults(allResults)
    } catch (error) {
      console.error("Error generating domains:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const generateDomainCombinations = (searchParams: {
    keywords: string[]
    country: string
    state: string
    keywordPosition: string
    extension: string
    swapWords: boolean
    minLength: number
    maxLength: number
  }) => {
    const domains: Omit<DomainResult, "available" | "trademark">[] = []

    // Get all cities for the selected country and state
    const countryData = countriesData.find((country) => country.code === searchParams.country)
    const cities = countryData ? countryData.cities.filter((city) => city.state === searchParams.state) : []

    // Use only the first keyword (single keyword mode)
    const keyword = searchParams.keywords[0]
    if (!keyword) return domains

    cities.forEach((cityData) => {
      const cleanCity = cityData.name.replace(/[^a-zA-Z0-9]/g, "")
      const cleanKeyword = keyword.replace(/[^a-zA-Z0-9]/g, "")

      // Skip if either city or keyword becomes empty after cleaning
      if (!cleanCity || !cleanKeyword) return

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
        {loading && (
          <div className="text-center text-white mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg font-medium">Smart filtering domains...</p>
              <p className="text-sm opacity-80">Filtering cities in selected state</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function getPopulationForCity(city: string): number {
  const cityPopulationMap: Record<string, number> = {
    "New York": 8336817,
    "Los Angeles": 3979576,
    Chicago: 2671635,
    Houston: 2320268,
    Phoenix: 1680992,
    Philadelphia: 1585480,
    "San Antonio": 1547253,
    "San Diego": 1423851,
    Dallas: 1343573,
    Austin: 978908,
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
