import { useState, useCallback, useEffect } from 'react'
import { useWallet } from '../components/wallet/WalletProvider'
import { PROGRAMS } from './useAleoTransaction'

interface WalletRecord {
  id: string
  owner: string
  data: Record<string, unknown>
  programId: string
  nonce: string
}

interface UseWalletRecordsOptions {
  programId: string
  autoFetch?: boolean
}

export function useWalletRecords({ programId, autoFetch = true }: UseWalletRecordsOptions) {
  const { isConnected, getRecords } = useWallet()
  const [records, setRecords] = useState<WalletRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = useCallback(async () => {
    if (!isConnected) {
      setRecords([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await getRecords(programId)
      setRecords(result as WalletRecord[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch records')
      setRecords([])
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, getRecords, programId])

  useEffect(() => {
    if (autoFetch && isConnected) {
      fetchRecords()
    }
  }, [autoFetch, isConnected, fetchRecords])

  return {
    records,
    isLoading,
    error,
    refetch: fetchRecords,
  }
}

// Specific hooks for different record types

export function usePostOwnershipRecords() {
  const result = useWalletRecords({ programId: PROGRAMS.POST })
  
  return {
    ...result,
    posts: result.records.filter(r => r.data.hasOwnProperty('post_id')),
  }
}

export function useReactionRecords() {
  const result = useWalletRecords({ programId: PROGRAMS.REACTION })
  
  return {
    ...result,
    reactions: result.records.filter(r => r.data.hasOwnProperty('reaction_type')),
  }
}

export function useFollowRecords() {
  const result = useWalletRecords({ programId: PROGRAMS.FOLLOW })
  
  return {
    ...result,
    follows: result.records.filter(r => r.data.hasOwnProperty('following_hash')),
  }
}

export function useGroupMembershipRecords() {
  const result = useWalletRecords({ programId: PROGRAMS.GROUP })
  
  return {
    ...result,
    memberships: result.records.filter(r => r.data.hasOwnProperty('encryption_key')),
    ownedGroups: result.records.filter(r => r.data.hasOwnProperty('created_at') && !r.data.hasOwnProperty('joined_at')),
  }
}

export function useIdentityRecords() {
  const result = useWalletRecords({ programId: PROGRAMS.IDENTITY })
  
  return {
    ...result,
    identity: result.records.find(r => r.data.hasOwnProperty('pseudonym_hash')),
    verifiedAttributes: result.records.filter(r => r.data.hasOwnProperty('attribute_type')),
  }
}
