// Custom hook for fetching lapangans (fields)
import { useState, useEffect } from 'react'
import type { Lapangan } from '../types/api'

export function useLapangans() {
  const [lapangans, setLapangans] = useState<Lapangan[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLapangans = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/search/lapangans')

      if (!response.ok) {
        throw new Error('Failed to fetch lapangans')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch lapangans')
      }

      setLapangans(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLapangans()
  }, [])

  return { lapangans, loading, error, refetch: fetchLapangans }
}