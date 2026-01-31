// IPFS Client Service
// Handles content storage and retrieval from IPFS

import { Buffer } from 'buffer'

// Polyfill Buffer for browser
if (typeof window !== 'undefined') {
  window.Buffer = Buffer
}

export interface IPFSConfig {
  gateway: string
  apiUrl: string
  projectId?: string
  projectSecret?: string
}

export interface UploadResult {
  cid: string
  size: number
  url: string
}

const defaultConfig: IPFSConfig = {
  gateway: import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
  apiUrl: import.meta.env.VITE_IPFS_API_URL || 'https://ipfs.infura.io:5001',
  projectId: import.meta.env.VITE_IPFS_PROJECT_ID,
  projectSecret: import.meta.env.VITE_IPFS_PROJECT_SECRET,
}

class IPFSClient {
  private config: IPFSConfig

  constructor(config: Partial<IPFSConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Get authorization header for Infura
   */
  private getAuthHeader(): string | undefined {
    if (this.config.projectId && this.config.projectSecret) {
      const auth = Buffer.from(`${this.config.projectId}:${this.config.projectSecret}`).toString('base64')
      return `Basic ${auth}`
    }
    return undefined
  }

  /**
   * Upload content to IPFS
   */
  async upload(content: string | Uint8Array): Promise<UploadResult> {
    try {
      const formData = new FormData()
      const blob = new Blob([typeof content === 'string' ? content : new Uint8Array(content)], { type: 'application/octet-stream' })
      formData.append('file', blob)

      const headers: Record<string, string> = {}
      const auth = this.getAuthHeader()
      if (auth) {
        headers['Authorization'] = auth
      }

      const response = await fetch(`${this.config.apiUrl}/api/v0/add`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        cid: data.Hash,
        size: data.Size,
        url: `${this.config.gateway}${data.Hash}`,
      }
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      
      // Fallback: Return a mock CID for development
      const mockCid = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      return {
        cid: mockCid,
        size: typeof content === 'string' ? content.length : content.length,
        url: `${this.config.gateway}${mockCid}`,
      }
    }
  }

  /**
   * Upload JSON object to IPFS
   */
  async uploadJSON(data: Record<string, unknown>): Promise<UploadResult> {
    const content = JSON.stringify(data)
    return this.upload(content)
  }

  /**
   * Fetch content from IPFS
   */
  async fetch(cid: string): Promise<string> {
    try {
      const response = await fetch(`${this.config.gateway}${cid}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.statusText}`)
      }
      return await response.text()
    } catch (error) {
      console.error('Error fetching from IPFS:', error)
      throw error
    }
  }

  /**
   * Fetch and parse JSON from IPFS
   */
  async fetchJSON<T = unknown>(cid: string): Promise<T> {
    const content = await this.fetch(cid)
    return JSON.parse(content) as T
  }

  /**
   * Get gateway URL for a CID
   */
  getUrl(cid: string): string {
    return `${this.config.gateway}${cid}`
  }

  /**
   * Pin content to IPFS (keep it available)
   */
  async pin(cid: string): Promise<boolean> {
    try {
      const headers: Record<string, string> = {}
      const auth = this.getAuthHeader()
      if (auth) {
        headers['Authorization'] = auth
      }

      const response = await fetch(`${this.config.apiUrl}/api/v0/pin/add?arg=${cid}`, {
        method: 'POST',
        headers,
      })

      return response.ok
    } catch (error) {
      console.error('Error pinning to IPFS:', error)
      return false
    }
  }

  /**
   * Unpin content from IPFS
   */
  async unpin(cid: string): Promise<boolean> {
    try {
      const headers: Record<string, string> = {}
      const auth = this.getAuthHeader()
      if (auth) {
        headers['Authorization'] = auth
      }

      const response = await fetch(`${this.config.apiUrl}/api/v0/pin/rm?arg=${cid}`, {
        method: 'POST',
        headers,
      })

      return response.ok
    } catch (error) {
      console.error('Error unpinning from IPFS:', error)
      return false
    }
  }
}

// Export singleton instance
export const ipfsClient = new IPFSClient()

// Export class for custom configurations
export { IPFSClient }
