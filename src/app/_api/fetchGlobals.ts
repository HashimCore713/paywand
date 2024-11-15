import type { Category, Footer, Header, Settings } from '../../payload/payload-types'
import { CATEGORIES } from '../_graphql/categories'
import { FOOTER_QUERY, HEADER_QUERY, SETTINGS_QUERY } from '../_graphql/globals'
import { GRAPHQL_API_URL } from './shared'

async function fetchWithRetry(url: string, options: RequestInit, retries = 5): Promise<any> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options)

    const contentType = response.headers.get('Content-Type')
    const text = await response.text()

    if (response.ok) {
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = JSON.parse(text)
          return data
        } catch (error: any) {
          throw new Error('Error parsing JSON response')
        }
      } else {
        // Handle non-JSON responses appropriately
        return text
      }
    } else {
      if (response.status === 429) {
        let retryAfterStr = response.headers.get('Retry-After')
        let retryAfter: number

        if (retryAfterStr) {
          retryAfter = parseInt(retryAfterStr, 10) * 1000 // convert to milliseconds
        } else {
          retryAfter = Math.min(2 ** i * 1000, 16000)
        }

        console.log(`Too Many Requests, retrying in ${retryAfter / 1000} seconds...`)
        await new Promise(resolve => setTimeout(resolve, retryAfter))
      } else {
        throw new Error(`Error fetching: ${response.statusText}`)
      }
    }
  }

  throw new Error('Max retries reached')
}

export async function fetchSettings(): Promise<Settings> {
  if (!GRAPHQL_API_URL) throw new Error('NEXT_PUBLIC_SERVER_URL not found')

  const response = await fetchWithRetry(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      query: SETTINGS_QUERY,
    }),
  })

  if (typeof response === 'string') {
    throw new Error(`Error fetching settings: ${response}`)
  }

  if (response?.errors) {
    throw new Error(response?.errors[0]?.message || 'Error fetching settings')
  }

  return response.data?.Settings || {}
}

export async function fetchCategories(): Promise<Category[]> {
  if (!GRAPHQL_API_URL) throw new Error('NEXT_PUBLIC_SERVER_URL not found')

  const response = await fetchWithRetry(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      query: CATEGORIES,
    }),
  })

  if (typeof response === 'string') {
    throw new Error(`Error fetching categories: ${response}`)
  }

  if (response?.errors) {
    throw new Error(response.errors[0]?.message || 'Error fetching categories')
  }

  return response.data?.Categories.docs || [] // Assuming the data structure matches
}

export async function fetchHeader(): Promise<Header> {
  if (!GRAPHQL_API_URL) throw new Error('NEXT_PUBLIC_SERVER_URL not found')

  const response = await fetchWithRetry(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      query: HEADER_QUERY,
    }),
  })

  if (typeof response === 'string') {
    throw new Error(`Error fetching header: ${response}`)
  }

  if (response?.errors) {
    throw new Error(response?.errors[0]?.message || 'Error fetching header')
  }

  return response.data?.Header || {}
}

export async function fetchFooter(): Promise<Footer> {
  if (!GRAPHQL_API_URL) throw new Error('NEXT_PUBLIC_SERVER_URL not found')

  const response = await fetchWithRetry(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: FOOTER_QUERY,
    }),
  })

  if (typeof response === 'string') {
    throw new Error(`Error fetching footer: ${response}`)
  }

  if (response?.errors) {
    throw new Error(response?.errors[0]?.message || 'Error fetching footer')
  }

  return response.data?.Footer || {}
}

export const fetchGlobals = async (): Promise<{
  settings: Settings
  header: Header
  footer: Footer
}> => {
  // initiate requests in parallel, then wait for them to resolve
  // this will eagerly start to the fetch requests at the same time
  // see https://nextjs.org/docs/app/building-your-application/data-fetching/fetching
  const settingsData = fetchSettings()
  const headerData = fetchHeader()
  const footerData = fetchFooter()

  const [settings, header, footer]: [Settings, Header, Footer] = await Promise.all([
    settingsData,
    headerData,
    footerData,
  ])

  return {
    settings,
    header,
    footer,
  }
}
