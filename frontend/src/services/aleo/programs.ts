// Aleo Programs Service
// Handles interactions with AnoneX Leo programs

import { aleoClient, TransactionResult } from './client'

// Program IDs
const PROGRAMS = {
  post: import.meta.env.VITE_POST_PROGRAM_ID || 'anonex_post.aleo',
  reaction: import.meta.env.VITE_REACTION_PROGRAM_ID || 'anonex_reaction.aleo',
  follow: import.meta.env.VITE_FOLLOW_PROGRAM_ID || 'anonex_follow.aleo',
  group: import.meta.env.VITE_GROUP_PROGRAM_ID || 'anonex_group.aleo',
  identity: import.meta.env.VITE_IDENTITY_PROGRAM_ID || 'anonex_identity.aleo',
}

// Post Module
export const postProgram = {
  /**
   * Publish a new anonymous post
   */
  async publishPost(
    contentCid: string,
    privateKey: string
  ): Promise<TransactionResult> {
    const timestamp = Math.floor(Date.now() / 1000)
    const nonce = Math.random().toString()

    // Convert to field format (in production, use proper field encoding)
    const inputs = [
      `${contentCid}field`, // content_cid as field
      `${timestamp}u64`,     // timestamp
      `${nonce}field`,       // nonce
    ]

    return aleoClient.execute(PROGRAMS.post, 'publish_post', inputs, privateKey)
  },

  /**
   * Get post metadata from on-chain mapping
   */
  async getPost(postId: string): Promise<unknown> {
    return aleoClient.getMappingValue(PROGRAMS.post, 'posts', postId)
  },

  /**
   * Get total post count
   */
  async getPostCount(): Promise<number> {
    const result = await aleoClient.getMappingValue(PROGRAMS.post, 'post_counter', '0u8')
    return result ? Number(result) : 0
  },
}

// Reaction Module
export const reactionProgram = {
  /**
   * Add a reaction to a post
   */
  async addReaction(
    postId: string,
    reactionType: 1 | 2 | 3 | 4, // LIKE, LOVE, FIRE, THINK
    privateKey: string
  ): Promise<TransactionResult> {
    const timestamp = Math.floor(Date.now() / 1000)
    
    const inputs = [
      `${postId}field`,
      `${reactionType}u8`,
      `${timestamp}u64`,
    ]

    return aleoClient.execute(PROGRAMS.reaction, 'add_reaction', inputs, privateKey)
  },

  /**
   * Get reaction count for a post
   */
  async getReactionCount(postId: string): Promise<number> {
    const result = await aleoClient.getMappingValue(PROGRAMS.reaction, 'reaction_counts', postId)
    return result ? Number(result) : 0
  },

  /**
   * Get like count for a post
   */
  async getLikeCount(postId: string): Promise<number> {
    const result = await aleoClient.getMappingValue(PROGRAMS.reaction, 'like_counts', postId)
    return result ? Number(result) : 0
  },
}

// Follow Module
export const followProgram = {
  /**
   * Follow a user
   */
  async followUser(
    targetUserHash: string,
    privateKey: string
  ): Promise<TransactionResult> {
    const timestamp = Math.floor(Date.now() / 1000)
    
    const inputs = [
      `${targetUserHash}field`,
      `${timestamp}u64`,
    ]

    return aleoClient.execute(PROGRAMS.follow, 'follow_user', inputs, privateKey)
  },

  /**
   * Get follower count for a user
   */
  async getFollowerCount(userHash: string): Promise<number> {
    const result = await aleoClient.getMappingValue(PROGRAMS.follow, 'follower_counts', userHash)
    return result ? Number(result) : 0
  },

  /**
   * Get following count for a user
   */
  async getFollowingCount(userHash: string): Promise<number> {
    const result = await aleoClient.getMappingValue(PROGRAMS.follow, 'following_counts', userHash)
    return result ? Number(result) : 0
  },
}

// Group Module
export const groupProgram = {
  /**
   * Create a new private group
   */
  async createGroup(
    nameHash: string,
    secret: string,
    privateKey: string
  ): Promise<TransactionResult> {
    const timestamp = Math.floor(Date.now() / 1000)
    const nonce = Math.random().toString()
    
    const inputs = [
      `${nameHash}field`,
      `${nonce}field`,
      `${secret}field`,
      `${timestamp}u64`,
    ]

    return aleoClient.execute(PROGRAMS.group, 'create_group', inputs, privateKey)
  },

  /**
   * Get group metadata
   */
  async getGroup(groupId: string): Promise<unknown> {
    return aleoClient.getMappingValue(PROGRAMS.group, 'groups', groupId)
  },

  /**
   * Get group member count
   */
  async getMemberCount(groupId: string): Promise<number> {
    const result = await aleoClient.getMappingValue(PROGRAMS.group, 'group_members', groupId)
    return result ? Number(result) : 0
  },
}

// Identity Module
export const identityProgram = {
  /**
   * Create a new anonymous identity
   */
  async createIdentity(
    salt: string,
    displayNameCid: string,
    avatarCid: string,
    bioCid: string,
    privateKey: string
  ): Promise<TransactionResult> {
    const timestamp = Math.floor(Date.now() / 1000)
    
    const inputs = [
      `${salt}field`,
      `${displayNameCid}field`,
      `${avatarCid}field`,
      `${bioCid}field`,
      `${timestamp}u64`,
    ]

    return aleoClient.execute(PROGRAMS.identity, 'create_identity', inputs, privateKey)
  },

  /**
   * Get profile metadata
   */
  async getProfile(pseudonymHash: string): Promise<unknown> {
    return aleoClient.getMappingValue(PROGRAMS.identity, 'profiles', pseudonymHash)
  },

  /**
   * Check if user is verified
   */
  async isVerified(pseudonymHash: string): Promise<boolean> {
    const result = await aleoClient.getMappingValue(PROGRAMS.identity, 'verified_users', pseudonymHash)
    return result === true
  },
}

export { PROGRAMS }
