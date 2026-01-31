import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Zap, TrendingUp } from 'lucide-react'
import { PostForm } from '../components/post/PostForm'
import { PostFeed } from '../components/post/PostFeed'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import type { Post } from '../components/post/PostCard'

// Mock data for demo
const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just discovered the power of zero-knowledge proofs on Aleo. The future of privacy is here! 🔐\n\nNo more sharing personal data to prove who you are. This is revolutionary.',
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
    content: 'Privacy is not about having something to hide. Privacy is about having the right to choose what to share and with whom.\n\n#PrivacyMatters #Aleo',
    authorPseudonym: 'SilentWolf789',
    authorHash: 'aleo1def...',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    likes: 156,
    comments: 23,
    shares: 42,
    isLiked: true,
  },
  {
    id: '3',
    content: 'Building something amazing on AnoneX. The ability to post anonymously while still proving certain attributes (like being a verified human) without revealing identity is mind-blowing.',
    authorPseudonym: 'MysticDragon123',
    authorHash: 'aleo1ghi...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 89,
    comments: 12,
    shares: 8,
    isVerified: true,
  },
  {
    id: '4',
    content: 'Web3 social media needs to be private by default. Tired of platforms selling my data. AnoneX on Aleo is the way forward.',
    authorPseudonym: 'NeonHawk55',
    authorHash: 'aleo1jkl...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    likes: 45,
    comments: 7,
    shares: 5,
  },
]

const stats = [
  { icon: Users, label: 'Anonymous Users', value: '12.5K', color: 'text-neon-cyan' },
  { icon: Shield, label: 'ZK Proofs Generated', value: '89.2K', color: 'text-neon-purple' },
  { icon: Zap, label: 'Posts Today', value: '2.3K', color: 'text-neon-pink' },
]

const trendingTopics = [
  { tag: '#PrivacyMatters', posts: 1234 },
  { tag: '#AleoNetwork', posts: 987 },
  { tag: '#ZeroKnowledge', posts: 756 },
  { tag: '#Web3Privacy', posts: 543 },
  { tag: '#AnoneX', posts: 432 },
]

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'latest' | 'trending' | 'following'>('latest')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setPosts(mockPosts)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreatePost = async (content: string) => {
    // Simulate post creation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      authorPseudonym: 'YourPseudonym',
      authorHash: 'aleo1new...',
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
    }
    
    setPosts(prev => [newPost, ...prev])
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 border border-white/10 p-8"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <Badge variant="primary" pulse className="mb-4">
            <Zap className="w-3 h-3" />
            Live on Aleo Testnet
          </Badge>
          
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
            Welcome to <span className="gradient-text">AnoneX</span>
          </h1>
          <p className="text-white/60 max-w-lg">
            The privacy-first anonymous social platform powered by Aleo's zero-knowledge proofs.
            Your voice matters, your identity doesn't have to.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <p className="font-display font-bold text-xl text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          <PostForm onSubmit={handleCreatePost} />
          <PostFeed
            posts={posts}
            isLoading={isLoading}
            filter={filter}
            onFilterChange={setFilter}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-neon-pink" />
                <h3 className="font-display font-semibold text-white">Trending</h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <motion.a
                    key={topic.tag}
                    href="#"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white group-hover:text-neon-cyan transition-colors">
                        {topic.tag}
                      </span>
                      <span className="text-xs text-white/40">{topic.posts} posts</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Privacy Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card padding="md" className="bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-neon-cyan" />
                <h3 className="font-display font-semibold text-white">Your Privacy</h3>
              </div>
              <p className="text-sm text-white/60 mb-4">
                All your posts are encrypted and verified using zero-knowledge proofs.
                Only you control your data.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-neon-green" />
                  <span className="text-white/70">End-to-end encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-neon-green" />
                  <span className="text-white/70">ZK proof verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-neon-green" />
                  <span className="text-white/70">No personal data stored</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
