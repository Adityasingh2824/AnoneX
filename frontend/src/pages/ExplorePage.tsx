import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Hash, TrendingUp, Users, Sparkles, Filter } from 'lucide-react'
import { Card } from '../components/common/Card'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Input } from '../components/common/Input'
import { cn } from '@/utils/cn'

type ExploreTab = 'trending' | 'topics' | 'people'

const trendingPosts = [
  {
    id: '1',
    content: 'The intersection of AI and zero-knowledge proofs is fascinating. Imagine proving you ran an ML model correctly without revealing the model or data...',
    author: 'TechVisionary99',
    likes: 342,
    timeAgo: '2h',
  },
  {
    id: '2',
    content: 'Privacy is the foundation of freedom. Without privacy, there can be no true freedom of thought or expression.',
    author: 'PrivacyAdvocate',
    likes: 289,
    timeAgo: '4h',
  },
  {
    id: '3',
    content: 'Just deployed my first Leo program on Aleo testnet! The developer experience is incredible. Privacy-first blockchain FTW!',
    author: 'AleoBuilder',
    likes: 198,
    timeAgo: '6h',
  },
]

const topics = [
  { name: 'Zero Knowledge', tag: '#ZK', posts: 5420, growth: '+12%', color: 'from-neon-cyan to-neon-blue' },
  { name: 'Privacy Tech', tag: '#PrivacyTech', posts: 4231, growth: '+8%', color: 'from-neon-purple to-neon-pink' },
  { name: 'Web3 Social', tag: '#Web3Social', posts: 3892, growth: '+23%', color: 'from-neon-pink to-neon-cyan' },
  { name: 'Aleo Network', tag: '#Aleo', posts: 2987, growth: '+45%', color: 'from-neon-green to-neon-cyan' },
  { name: 'Decentralization', tag: '#Decentralized', posts: 2654, growth: '+5%', color: 'from-yellow-400 to-orange-500' },
  { name: 'Cryptography', tag: '#Crypto', posts: 2341, growth: '+18%', color: 'from-red-400 to-pink-500' },
]

const suggestedUsers = [
  { pseudonym: 'CryptoSage', followers: 12500, isVerified: true, bio: 'ZK researcher & privacy advocate' },
  { pseudonym: 'AleoEnthusiast', followers: 8900, isVerified: true, bio: 'Building on Aleo since day 1' },
  { pseudonym: 'PrivacyPundit', followers: 7200, isVerified: false, bio: 'Making privacy accessible to everyone' },
  { pseudonym: 'ZKWizard', followers: 6100, isVerified: true, bio: 'Cryptographer. ZK maximalist.' },
  { pseudonym: 'Web3Native', followers: 5400, isVerified: false, bio: 'Full-stack Web3 developer' },
]

export function ExplorePage() {
  const [activeTab, setActiveTab] = useState<ExploreTab>('trending')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'trending' as const, label: 'Trending', icon: TrendingUp },
    { id: 'topics' as const, label: 'Topics', icon: Hash },
    { id: 'people' as const, label: 'People', icon: Users },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Explore</h1>
            <p className="text-white/60">Discover trending content and people</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search topics, posts, or people..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/70'
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="exploreActiveTab"
                  className="absolute inset-0 rounded-lg bg-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon className="relative w-4 h-4" />
              <span className="relative">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {activeTab === 'trending' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {trendingPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="interactive" padding="md">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar pseudonym={post.author} size="sm" />
                      <span className="font-medium text-white">{post.author}</span>
                      <span className="text-white/40 text-sm">· {post.timeAgo}</span>
                    </div>
                    <p className="text-white/80 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <TrendingUp className="w-4 h-4 text-neon-pink" />
                      <span>{post.likes} likes</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'topics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {topics.map((topic, index) => (
            <motion.div
              key={topic.tag}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="interactive" padding="md" className="group">
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${topic.color} text-white text-sm font-medium mb-2`}>
                      {topic.tag}
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-neon-cyan transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-sm text-white/50">{topic.posts.toLocaleString()} posts</p>
                  </div>
                  <Badge variant="success" className="text-xs">
                    {topic.growth}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'people' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {suggestedUsers.map((user, index) => (
            <motion.div
              key={user.pseudonym}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="interactive" padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar pseudonym={user.pseudonym} size="lg" verified={user.isVerified} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{user.pseudonym}</span>
                        {user.isVerified && (
                          <Badge variant="primary" className="text-[10px] px-1.5 py-0.5">Verified</Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/50">{user.bio}</p>
                      <p className="text-xs text-white/40 mt-1">{user.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    Follow
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
