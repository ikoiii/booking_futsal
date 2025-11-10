// Custom hooks for API calls
import { useState, useEffect } from 'react'
import type { ApiResponse } from '../types/api'

// Generic API hook
export function useApi<T>(
  url: string | null,
  options?: RequestInit
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      const result: ApiResponse<T> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'API request failed')
      }

      setData(result.data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, loading, error, refetch: fetchData }
}

// Hook for POST requests
export function useApiMutation<T, P = any>(
  url: string,
  options?: RequestInit
) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (payload?: P): Promise<T | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: payload ? JSON.stringify(payload) : undefined,
        ...options,
      })

      const result: ApiResponse<T> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'API request failed')
      }

      return result.data || null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}