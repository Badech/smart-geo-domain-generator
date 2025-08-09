"use client"

import { useState, useMemo, useCallback } from "react"
import type { Country } from "../data/cities"
import { generateDomains, parseKeywords, type CityPosition } from "../utils/domainGenerator"

export function useDomainGenerator() {
  const [keywords, setKeywords] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [cityPosition, setCityPosition] = useState<CityPosition>("end")
  const [tld, setTld] = useState("com")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(50)

  const parsedKeywords = useMemo(() => parseKeywords(keywords), [keywords])

  const selectedCities = useMemo(() => selectedCountry?.cities || [], [selectedCountry])

  const allDomains = useMemo(() => {
    if (parsedKeywords.length === 0 || selectedCities.length === 0) {
      return []
    }
    return generateDomains(parsedKeywords, selectedCities, cityPosition, tld)
  }, [parsedKeywords, selectedCities, cityPosition, tld])

  // Paginated domains
  const paginatedDomains = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allDomains.slice(startIndex, endIndex)
  }, [allDomains, currentPage, itemsPerPage])

  const totalPages = useMemo(() => Math.ceil(allDomains.length / itemsPerPage), [allDomains.length, itemsPerPage])

  const generateAsync = useCallback(async () => {
    setIsGenerating(true)
    setCurrentPage(1) // Reset to first page
    // Simulate async processing for large datasets
    await new Promise((resolve) => setTimeout(resolve, 100))
    setIsGenerating(false)
  }, [])

  const stats = useMemo(
    () => ({
      keywordCount: parsedKeywords.length,
      cityCount: selectedCities.length,
      domainCount: allDomains.length,
    }),
    [parsedKeywords.length, selectedCities.length, allDomains.length],
  )

  return {
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
    itemsPerPage,
    isGenerating,
    generateAsync,
    stats,
  }
}
