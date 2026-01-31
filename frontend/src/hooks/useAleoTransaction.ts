import { useState, useCallback } from 'react'
import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base'
import { useWallet, type AleoTransaction } from '../components/wallet/WalletProvider'

// Program IDs
export const PROGRAMS = {
  POST: 'anonex_post.aleo',
  REACTION: 'anonex_reaction.aleo',
  FOLLOW: 'anonex_follow.aleo',
  GROUP: 'anonex_group.aleo',
  IDENTITY: 'anonex_identity.aleo',
} as const

export type ProgramId = typeof PROGRAMS[keyof typeof PROGRAMS]

interface TransactionState {
  status: 'idle' | 'preparing' | 'signing' | 'broadcasting' | 'confirming' | 'confirmed' | 'failed'
  transactionId: string | null
  error: string | null
}

interface UseAleoTransactionOptions {
  onSuccess?: (transactionId: string) => void
  onError?: (error: Error) => void
}

export function useAleoTransaction(options: UseAleoTransactionOptions = {}) {
  const { address, requestTransaction, transactionStatus, isDemoMode } = useWallet()
  const [state, setState] = useState<TransactionState>({
    status: 'idle',
    transactionId: null,
    error: null,
  })

  const execute = useCallback(async (
    programId: ProgramId,
    functionName: string,
    inputs: string[],
    fee: number = 100000 // 0.0001 Aleo credits
  ): Promise<string> => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    setState({ status: 'preparing', transactionId: null, error: null })

    try {
      // Create the transaction
      const transaction: AleoTransaction = {
        address,
        chainId: WalletAdapterNetwork.TestnetBeta,
        transitions: [{
          program: programId,
          functionName,
          inputs,
        }],
        fee,
        privateFee: false,
      }

      setState({ status: 'signing', transactionId: null, error: null })

      // Request the transaction to be signed and broadcast
      const txId = await requestTransaction(transaction)

      setState({ status: 'broadcasting', transactionId: txId, error: null })

      // Wait for confirmation
      setState({ status: 'confirming', transactionId: txId, error: null })

      // In demo mode, just simulate confirmation
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setState({ status: 'confirmed', transactionId: txId, error: null })
        options.onSuccess?.(txId)
        return txId
      }

      // Poll for transaction status
      let attempts = 0
      const maxAttempts = 30
      
      while (attempts < maxAttempts) {
        try {
          const status = await transactionStatus(txId)
          if (status === 'Finalized' || status === 'Confirmed') {
            setState({ status: 'confirmed', transactionId: txId, error: null })
            options.onSuccess?.(txId)
            return txId
          }
          if (status === 'Failed' || status === 'Rejected') {
            throw new Error(`Transaction ${status.toLowerCase()}`)
          }
        } catch {
          // Continue polling
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000))
        attempts++
      }

      // If we get here, assume success (wallet handled it)
      setState({ status: 'confirmed', transactionId: txId, error: null })
      options.onSuccess?.(txId)
      return txId

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed'
      setState({ status: 'failed', transactionId: null, error: errorMessage })
      options.onError?.(error instanceof Error ? error : new Error(errorMessage))
      throw error
    }
  }, [address, requestTransaction, transactionStatus, isDemoMode, options])

  const reset = useCallback(() => {
    setState({ status: 'idle', transactionId: null, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
    isLoading: ['preparing', 'signing', 'broadcasting', 'confirming'].includes(state.status),
    isSuccess: state.status === 'confirmed',
    isError: state.status === 'failed',
  }
}

// Specific transaction hooks for each program

export function usePublishPost() {
  const transaction = useAleoTransaction()

  const publishPost = useCallback(async (
    contentCid: string,
    timestamp: number = Date.now()
  ) => {
    const nonce = Math.floor(Math.random() * 1000000)
    
    // Convert to Aleo field format
    const inputs = [
      `${contentCid}field`,
      `${Math.floor(timestamp / 1000)}u64`,
      `${nonce}field`,
    ]

    return transaction.execute(PROGRAMS.POST, 'publish_post', inputs)
  }, [transaction])

  return {
    ...transaction,
    publishPost,
  }
}

export function useAddReaction() {
  const transaction = useAleoTransaction()

  const addReaction = useCallback(async (
    postId: string,
    reactionType: 1 | 2 | 3 | 4, // 1=like, 2=love, 3=fire, 4=think
    timestamp: number = Date.now()
  ) => {
    const inputs = [
      `${postId}field`,
      `${reactionType}u8`,
      `${Math.floor(timestamp / 1000)}u64`,
    ]

    return transaction.execute(PROGRAMS.REACTION, 'add_reaction', inputs)
  }, [transaction])

  return {
    ...transaction,
    addReaction,
  }
}

export function useFollowUser() {
  const transaction = useAleoTransaction()

  const followUser = useCallback(async (
    targetUserHash: string,
    timestamp: number = Date.now()
  ) => {
    const inputs = [
      `${targetUserHash}field`,
      `${Math.floor(timestamp / 1000)}u64`,
    ]

    return transaction.execute(PROGRAMS.FOLLOW, 'follow_user', inputs)
  }, [transaction])

  return {
    ...transaction,
    followUser,
  }
}

export function useCreateGroup() {
  const transaction = useAleoTransaction()

  const createGroup = useCallback(async (
    nameHash: string,
    secret: string,
    timestamp: number = Date.now()
  ) => {
    const nonce = Math.floor(Math.random() * 1000000)
    
    const inputs = [
      `${nameHash}field`,
      `${nonce}field`,
      `${secret}field`,
      `${Math.floor(timestamp / 1000)}u64`,
    ]

    return transaction.execute(PROGRAMS.GROUP, 'create_group', inputs)
  }, [transaction])

  return {
    ...transaction,
    createGroup,
  }
}

export function useCreateIdentity() {
  const transaction = useAleoTransaction()

  const createIdentity = useCallback(async (
    displayNameCid: string,
    avatarCid: string,
    bioCid: string,
    timestamp: number = Date.now()
  ) => {
    const salt = Math.floor(Math.random() * 1000000000)
    
    const inputs = [
      `${salt}field`,
      `${displayNameCid}field`,
      `${avatarCid}field`,
      `${bioCid}field`,
      `${Math.floor(timestamp / 1000)}u64`,
    ]

    return transaction.execute(PROGRAMS.IDENTITY, 'create_identity', inputs)
  }, [transaction])

  return {
    ...transaction,
    createIdentity,
  }
}
