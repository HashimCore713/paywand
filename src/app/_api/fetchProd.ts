import { PRODUCT } from '../_graphql/products'
import { GRAPHQL_API_URL } from './shared'

export const fetchProd = async <T>(slug: string, draft?: boolean): Promise<T | null> => {
  const token = draft ? await getDraftToken() : undefined

  const response = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && draft ? { Authorization: `JWT ${token}` } : {}),
    },
    cache: 'no-store',
    body: JSON.stringify({
      query: PRODUCT,
      variables: { slug, draft },
    }),
  })

  const text = await response.text()
  console.log('Raw response text:', text)

  try {
    const data = JSON.parse(text)
    if (data.errors) {
      throw new Error(data.errors[0]?.message ?? 'Error fetching product')
    }
    return data?.data?.Products?.docs[0] ?? null
  } catch (error) {
    console.error('Error parsing JSON:', error)
    throw error
  }
}

const getDraftToken = async (): Promise<string> => {
  // Define your logic to get draft token here if needed
  return 'your-draft-token'
}
