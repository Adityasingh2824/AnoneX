import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postProgram } from '../services/aleo/programs'
import { ipfsClient } from '../services/ipfs/client'
import { encryptPostContent, hashContent } from '../services/ipfs/encryption'
import type { Post } from '../components/post/PostCard'

interface UsePostsOptions {
  filter?: 'latest' | 'trending' | 'following'
  limit?: number
}

interface CreatePostInput {
  content: string
  isPublic?: boolean
  privateKey: string
}

// Mock posts for development
const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just discovered the power of zero-knowledge proofs on Aleo. The future of privacy is here! 🔐',
    authorPseudonym: 'CryptoPhoenix42',
    authorHash: 'aleo1abc...',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    likes: 24,
    comments: 5,
    shares: 3,
    isVerified: true,
  },
  {
    id: '2',
    content: 'Privacy is not about having something to hide. Privacy is about having the right to choose what to share.',
    authorPseudonym: 'SilentWolf789',
    authorHash: 'aleo1def...',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    likes: 156,
    comments: 23,
    shares: 42,
  },
]

export function usePosts(options: UsePostsOptions = {}) {
  const { filter = 'latest', limit = 20 } = options
  const queryClient = useQueryClient()

  // Fetch posts
  const {
    data: posts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts', filter, limit],
    queryFn: async () => {
      // In production, fetch from Aleo network and IPFS
      // For now, return mock data
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockPosts
    },
  })

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async ({ content, privateKey, isPublic = true }: CreatePostInput) => {
      // 1. Encrypt content if private
      const { encryptedContent, key } = await encryptPostContent(content)
      
      // 2. Upload to IPFS
      const uploadResult = await ipfsClient.uploadJSON({
        content: isPublic ? content : encryptedContent,
        encrypted: !isPublic,
        timestamp: Date.now(),
      })

      // 3. Generate content hash for on-chain storage
      const contentHash = await hashContent(uploadResult.cid)

      // 4. Submit to Aleo network
      const txResult = await postProgram.publishPost(contentHash, privateKey)

      return {
        transactionId: txResult.transactionId,
        contentCid: uploadResult.cid,
        encryptionKey: isPublic ? undefined : key,
      }
    },
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return {
    posts,
    isLoading,
    error,
    refetch,
    createPost: createPostMutation.mutate,
    isCreating: createPostMutation.isPending,
    createError: createPostMutation.error,
  }
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      // Fetch post from Aleo network
      const postData = await postProgram.getPost(postId)
      if (!postData) return null

      // Fetch content from IPFS
      // const content = await ipfsClient.fetchJSON(postData.contentCid)

      return postData
    },
    enabled: !!postId,
  })
}

export function useReaction(postId: string) {
  const queryClient = useQueryClient()
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null)

  const likeMutation = useMutation({
    mutationFn: async (_args: { privateKey: string }) => {
      // Optimistic update
      setOptimisticLiked(true)
      
      // Submit reaction to Aleo
      // const result = await reactionProgram.addReaction(postId, 1, privateKey)
      
      // Simulate for demo
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return { success: true }
    },
    onError: () => {
      setOptimisticLiked(null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
    },
  })

  return {
    isLiked: optimisticLiked ?? false,
    like: likeMutation.mutate,
    isLiking: likeMutation.isPending,
  }
}
