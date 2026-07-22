import { shopConfig, type ShopConfig } from '../shops/dogra-associates/config'

let cachedConfig: ShopConfig | null = null

// Admin Panel public API endpoint (set via env var, fallback to localhost for dev)
const ADMIN_PANEL_URL = process.env.NEXT_PUBLIC_ADMIN_PANEL_URL || 'http://localhost:3002'
const SHOP_SLUG = 'dogra-associates'

export async function loadConfig(): Promise<ShopConfig> {
  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig
  }

  try {
    // Try to fetch from Admin Panel Supabase (via public API)
    try {
      const adminApiUrl = `${ADMIN_PANEL_URL}/api/public/config?shop_slug=${SHOP_SLUG}`
      const response = await fetch(adminApiUrl, {
        next: { revalidate: 30 }, // Revalidate every 30 seconds
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data?.config && Object.keys(data.config).length > 0) {
          // Merge admin config with local shopConfig (admin config takes precedence)
          cachedConfig = { ...shopConfig, ...data.config } as ShopConfig
          return cachedConfig
        }
      }
    } catch (fetchError) {
      console.warn('Failed to fetch from admin panel, using local config:', fetchError)
    }
  } catch (error) {
    console.error('Error loading config:', error)
  }

  // Return default local config (fallback)
  return shopConfig
}

export function getConfig(): ShopConfig {
  if (cachedConfig) {
    return cachedConfig
  }
  return shopConfig
}





