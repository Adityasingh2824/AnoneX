import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings, 
  Copy, 
  Check, 
  Shield, 
  Calendar, 
  Link as LinkIcon,
  Edit3,
  Grid3X3,
  Heart,
  MessageCircle
} from 'lucide-react'
import { Card } from '../components/common/Card'
import { Avatar } from '../components/common/Avatar'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { PostCard, Post } from '../components/post/PostCard'
import { useWallet } from '../components/wallet/WalletProvider'
import { cn } from '@/utils/cn'

type ProfileTab = 'posts' | 'likes' | 'replies'

const mockUserPosts: Post[] = [
  {
    id: '1',
    content: 'Just shipped a new feature for AnoneX! Privacy-preserving group chats are coming soon. Stay tuned! 🚀',
    authorPseudonym: 'YourPseudonym',
    authorHash: 'aleo1...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 45,
    comments: 12,
    shares: 5,
  },
  {
    id: '2',
    content: 'The future of social media is private by default. No more selling user data. No more targeted manipulation. Just pure, anonymous expression.',
    authorPseudonym: 'YourPseudonym',
    authorHash: 'aleo1...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    likes: 89,
    comments: 23,
    shares: 15,
  },
]

const stats = [
  { label: 'Posts', value: 42 },
  { label: 'Followers', value: 1234 },
  { label: 'Following', value: 567 },
]

export function ProfilePage() {
  const { isConnected, pseudonym, address } = useWallet()
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts')
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const tabs = [
    { id: 'posts' as const, label: 'Posts', icon: Grid3X3 },
    { id: 'likes' as const, label: 'Likes', icon: Heart },
    { id: 'replies' as const, label: 'Replies', icon: MessageCircle },
  ]

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card padding="lg" className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
            <User className="w-10 h-10 text-neon-cyan" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-3">
            View Your Profile
          </h2>
          <p className="text-white/60 mb-6 max-w-sm mx-auto">
            Connect your Aleo wallet to view your anonymous profile and activity.
          </p>
          <Button onClick={() => {}} size="lg">
            Connect Wallet
          </Button>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card padding="none" className="overflow-hidden">
          {/* Cover */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-neon-cyan/30 via-neon-purple/30 to-neon-pink/30 relative">
            <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/20 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-12 sm:-mt-16 mb-4">
              <Avatar 
                pseudonym={pseudonym || undefined} 
                size="xl" 
                showRing 
                verified 
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-void-950 border border-white/20 text-white/60 hover:text-white transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Name & Info */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display font-bold text-2xl text-white">{pseudonym}</h1>
                  <Badge variant="primary">
                    <Shield className="w-3 h-3" />
                    Verified
                  </Badge>
                </div>
                
                {/* Address */}
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-white/70 transition-colors group"
                >
                  <span className="font-mono">{address?.slice(0, 12)}...{address?.slice(-8)}</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-neon-green" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>

                {/* Bio */}
                <p className="mt-3 text-white/70 max-w-md">
                  Building the future of privacy-first social media. Believer in zero-knowledge proofs and user sovereignty. 🔐
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 mt-3 text-sm text-white/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined January 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    anonex.io
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" icon={<Settings className="w-4 h-4" />}>
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
              {stats.map((stat) => (
                <button key={stat.label} className="text-center group">
                  <p className="font-display font-bold text-xl text-white group-hover:text-neon-cyan transition-colors">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Content Tabs */}
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
                layoutId="profileActiveTab"
                className="absolute inset-0 rounded-lg bg-white/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <tab.icon className="relative w-4 h-4" />
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {mockUserPosts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </motion.div>
    </motion.div>
  )
}
