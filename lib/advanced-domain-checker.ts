// More comprehensive domain checking with multiple fallback methods
export class DomainChecker {
  private static instance: DomainChecker
  private cache = new Map<string, { available: boolean; timestamp: number }>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  static getInstance(): DomainChecker {
    if (!DomainChecker.instance) {
      DomainChecker.instance = new DomainChecker()
    }
    return DomainChecker.instance
  }

  async checkAvailability(domain: string): Promise<boolean> {
    // Check cache first
    const cached = this.cache.get(domain)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.available
    }

    try {
      // Method 1: Try WHOIS API
      let available = await this.checkWithWhoisAPI(domain)
      
      if (available === null) {
        // Method 2: Try DNS resolution
        available = await this.checkWithDNS(domain)
      }
      
      if (available === null) {
        // Method 3: Try HTTP request
        available = await this.checkWithHTTP(domain)
      }
      
      // Default to unavailable if all methods fail
      const result = available ?? false
      
      // Cache the result
      this.cache.set(domain, { available: result, timestamp: Date.now() })
      
      return result
    } catch (error) {
      console.error(`Error checking domain ${domain}:`, error)
      return false // Assume taken if we can't check
    }
  }

  private async checkWithWhoisAPI(domain: string): Promise<boolean | null> {
    try {
      const response = await fetch(`https://api.whoisjson.com/v1/${domain}`)
      if (!response.ok) return null
      
      const data = await response.json()
      return !data.registered
    } catch {
      return null
    }
  }

  private async checkWithDNS(domain: string): Promise<boolean | null> {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`)
      if (!response.ok) return null
      
      const data = await response.json()
      // NXDOMAIN (status 3) means domain doesn't exist
      return data.Status === 3
    } catch {
      return null
    }
  }

  private async checkWithHTTP(domain: string): Promise<boolean | null> {
    try {
      // Try to fetch the domain - if it fails, might be available
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors'
      })
      
      clearTimeout(timeoutId)
      
      // If we get any response, domain is likely taken
      return false
    } catch (error) {
      // If request fails, domain might be available
      return true
    }
  }

  clearCache(): void {
    this.cache.clear()
  }
}

// Export singleton instance
export const domainChecker = DomainChecker.getInstance()
