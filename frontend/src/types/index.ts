// Core Types for AnoneX

// User/Identity Types
export interface User {
  pseudonym: string
  pseudonymHash: string
  address: string
  displayNameCid?: string
  avatarCid?: string
  bioCid?: string
  isVerified: boolean
  createdAt: Date
}

export interface UserProfile {
  pseudonym: string
  displayName?: string
  avatar?: string
  bio?: string
  followerCount: number
  followingCount: number
  postCount: number
  isVerified: boolean
  createdAt: Date
}

// Post Types
export interface Post {
  id: string
  content: string
  authorPseudonym: string
  authorHash: string
  contentCid?: string
  timestamp: Date
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
  isBookmarked?: boolean
  isVerified?: boolean
  visibility: 'public' | 'private' | 'group'
  groupId?: string
}

export interface PostMetadata {
  postId: string
  authorHash: string
  contentCid: string
  timestamp: number
  edited: boolean
  isActive: boolean
}

export interface CreatePostInput {
  content: string
  visibility: 'public' | 'private' | 'group'
  groupId?: string
}

// Reaction Types
export type ReactionType = 'like' | 'love' | 'fire' | 'think'

export interface Reaction {
  postId: string
  userHash: string
  type: ReactionType
  timestamp: Date
}

// Group Types
export interface Group {
  id: string
  name: string
  nameHash: string
  description?: string
  creatorHash: string
  memberCount: number
  postCount: number
  isPrivate: boolean
  createdAt: Date
}

export interface GroupMembership {
  groupId: string
  userAddress: string
  encryptionKey: string
  joinedAt: Date
}

// Transaction Types
export interface TransactionResult {
  transactionId: string
  status: 'pending' | 'confirmed' | 'failed'
  outputs?: Record<string, unknown>
  error?: string
}

// IPFS Types
export interface IPFSContent {
  cid: string
  size: number
  url: string
}

export interface EncryptedContent {
  ciphertext: string
  iv: string
  tag: string
}

// Notification Types
export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'group_invite'
  message: string
  fromPseudonym?: string
  postId?: string
  groupId?: string
  timestamp: Date
  read: boolean
}

// Settings Types
export interface UserSettings {
  displayName: string
  bio: string
  privacy: {
    allowFollowers: boolean
    showActivity: boolean
    allowDMs: boolean
  }
  notifications: {
    push: boolean
    email: boolean
    mentions: boolean
    followers: boolean
  }
  appearance: {
    theme: 'dark' | 'light' | 'system'
  }
  security: {
    twoFactorEnabled: boolean
  }
}

// API Response Types
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
