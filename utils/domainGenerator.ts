import type { City } from "../data/cities"

export type CityPosition = "start" | "end"

export interface DomainResult {
  domain: string
  keyword: string
  city: string
  state: string
  population?: number
  available?: boolean
}

export function generateDomains(
  keywords: string[],
  cities: City[],
  position: CityPosition,
  tld = "com",
): DomainResult[] {
  const domains: DomainResult[] = []

  for (const keyword of keywords) {
    for (const city of cities) {
      const cleanKeyword = cleanString(keyword)
      const cleanCity = cleanString(city.name)

      if (cleanKeyword && cleanCity) {
        const domain =
          position === "start" ? `${cleanCity}${cleanKeyword}.${tld}` : `${cleanKeyword}${cleanCity}.${tld}`

        domains.push({
          domain: domain.toLowerCase(),
          keyword: cleanKeyword,
          city: city.name,
          state: city.state,
          population: city.population,
        })
      }
    }
  }

  return domains
}

export function cleanString(str: string): string {
  return str
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "")
    .replace(/\s+/g, "")
}

export function parseKeywords(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0)
}

export function copyToClipboard(domains: DomainResult[]): void {
  const text = domains.map((d) => d.domain).join("\n")
  navigator.clipboard.writeText(text)
}

export function exportToCsv(domains: DomainResult[]): void {
  const headers = ["Domain", "Keyword", "City", "State", "Population"]
  const csvContent = [
    headers.join(","),
    ...domains.map((d) => [d.domain, d.keyword, d.city, d.state, d.population || ""].join(",")),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "domains.csv"
  a.click()
  URL.revokeObjectURL(url)
}
