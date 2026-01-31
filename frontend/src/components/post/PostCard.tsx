import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Flag, Flame, Sparkles } from 'lucide-react'
import { Avatar } from '../common/Avatar'
import { Badge } from '../common/Badge'
import { cn } from '@/utils/cn'

export interface Post {
  id: string
  content: string
  authorPseudonym: string
  authorHash: string
  timestamp: Date
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
  isBookmarked?: boolean
  isVerified?: boolean
  contentCid?: string
}

interface PostCardProps {
  post: Post
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onBookmark?: () => void
  index?: number
}

const reactionTypes = [
  { icon: Heart, color: 'text-red-400', bgColor: 'bg-red-500/20', label: 'Like' },
  { icon: Flame, color: 'text-orange-400', bgColor: 'bg-orange-500/20', label: 'Fire' },
  { icon: Sparkles, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', label: 'Wow' },
]

export function PostCard({ post, onLike, onComment, onShare, onBookmark, index = 0 }: PostCardProps) {
  const [showReactions, setShowReactions] = useState(false)
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
  const [showMenu, setShowMenu] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.()
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.()
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card-hover p-5 space-y-4 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            pseudonym={post.authorPseudonym}
            size="md"
            verified={post.isVerified}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{post.authorPseudonym}</span>
              {post.isVerified && (
                <Badge variant="primary" className="text-[10px] px-1.5 py-0.5">ZK Verified</Badge>
              )}
            </div>
            <p className="text-xs text-white/50">
              {formatDistanceToNow(post.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </motion.button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-full mt-1 w-40 z-50 rounded-xl bg-void-950/95 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
              >
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors">
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                  <Flag className="w-4 h-4" />
                  Report
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1">
          {/* Like button with reactions popup */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300',
                isLiked
                  ? 'text-red-400 bg-red-500/10'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
              <span className="text-sm font-medium">{likeCount}</span>
            </motion.button>

            {/* Reactions popup */}
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute bottom-full left-0 mb-2 flex items-center gap-1 p-2 rounded-xl bg-void-950/95 backdrop-blur-xl border border-white/10 shadow-xl"
              >
                {reactionTypes.map((reaction, i) => (
                  <motion.button
                    key={reaction.label}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.3, y: -5 }}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      reaction.bgColor
                    )}
                    title={reaction.label}
                  >
                    <reaction.icon className={cn('w-5 h-5', reaction.color)} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Comment button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComment}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comments}</span>
          </motion.button>

          {/* Share button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">{post.shares}</span>
          </motion.button>
        </div>

        {/* Bookmark */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBookmark}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isBookmarked
              ? 'text-neon-cyan bg-neon-cyan/10'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          )}
        >
          <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
        </motion.button>
      </div>
    </motion.article>
  )
}
