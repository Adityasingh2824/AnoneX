import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, TrendingUp, Clock, Sparkles } from 'lucide-react'
import { PostCard, Post } from './PostCard'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { cn } from '@/utils/cn'

type FeedFilter = 'latest' | 'trending' | 'following'

interface PostFeedProps {
  posts: Post[]
  isLoading?: boolean
  filter: FeedFilter
  onFilterChange: (filter: FeedFilter) => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

const filters: { id: FeedFilter; label: string; icon: typeof Clock }[] = [
  { id: 'latest', label: 'Latest', icon: Clock },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'following', label: 'Following', icon: Sparkles },
]

export function PostFeed({
  posts,
  isLoading,
  filter,
  onFilterChange,
  onRefresh,
  isRefreshing,
}: PostFeedProps) {
  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === f.id
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/70'
              )}
            >
              {filter === f.id && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-lg bg-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <f.icon className="relative w-4 h-4" />
              <span className="relative hidden sm:inline">{f.label}</span>
            </button>
          ))}
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('w-5 h-5', isRefreshing && 'animate-spin')} />
          </motion.button>
        )}
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-white/50">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-neon-cyan" />
          </div>
          <h3 className="font-display font-semibold text-xl text-white mb-2">
            No posts yet
          </h3>
          <p className="text-white/60 max-w-sm mx-auto">
            Be the first to share something anonymously. Your voice matters, and your privacy is protected.
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
