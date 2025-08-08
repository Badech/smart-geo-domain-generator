// Domain availability checking using WHOIS lookup
export async function checkDomainAvailability(domain: string): Promise<boolean> {
  try {
    // Using a free WHOIS API service
    const response = await fetch(`https://api.whoisjson.com/v1/${domain}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      // If API fails, try alternative method
      return await checkDomainAlternative(domain)
    }
    
    const data = await response.json()
    
    // If domain is available, the response will indicate it's not registered
    return !data.registered || data.status === 'available'
    
  } catch (error) {
    console.error('Error checking domain availability:', error)
    // Fallback to alternative checking method
    return await checkDomainAlternative(domain)
  }
}

// Alternative domain checking method using DNS lookup
async function checkDomainAlternative(domain: string): Promise<boolean> {
  try {
    // Try to resolve the domain - if it fails, domain might be available
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`)
    const data = await response.json()
    
    // If no answer section or status is NXDOMAIN, domain might be available
    return !data.Answer || data.Answer.length === 0 || data.Status === 3
    
  } catch (error) {
    console.error('Alternative domain check failed:', error)
    // If all checks fail, assume domain is taken to be safe
    return false
  }
}

// Trademark conflict checking (simplified version)
export async function checkTrademarkConflict(keyword: string): Promise<boolean> {
  try {
    // This is a simplified check - in production you'd use USPTO/WIPO APIs
    // For now, we'll check against a list of common trademarked terms
    const commonTrademarks = [
      'google', 'facebook', 'microsoft', 'apple', 'amazon', 'netflix', 'uber',
      'airbnb', 'spotify', 'twitter', 'instagram', 'linkedin', 'youtube',
      'walmart', 'target', 'starbucks', 'mcdonalds', 'nike', 'adidas',
      'coca-cola', 'pepsi', 'ford', 'toyota', 'bmw', 'mercedes'
    ]
    
    const lowerKeyword = keyword.toLowerCase()
    return commonTrademarks.some(trademark => 
      lowerKeyword.includes(trademark) || trademark.includes(lowerKeyword)
    )
    
  } catch (error) {
    console.error('Error checking trademark conflict:', error)
    return false // If check fails, assume no conflict
  }
}

// Rate limiting helper to avoid overwhelming APIs
export class RateLimiter {
  private queue: (() => Promise<any>)[] = []
  private processing = false
  private delay = 1000 // 1 second between requests

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      
      if (!this.processing) {
        this.process()
      }
    })
  }

  private async process() {
    this.processing = true
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift()
      if (fn) {
        await fn()
        await new Promise(resolve => setTimeout(resolve, this.delay))
      }
    }
    
    this.processing = false
  }
}

// Create a global rate limiter instance
export const domainCheckLimiter = new RateLimiter()
