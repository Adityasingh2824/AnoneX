import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Search, 
  Lock, 
  Globe, 
  Shield, 
  Sparkles,
  ChevronRight,
  MessageCircle
} from 'lucide-react'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'
import { Input, Textarea } from '../components/common/Input'
import { cn } from '@/utils/cn'

interface Group {
  id: string
  name: string
  description: string
  members: number
  posts: number
  isPrivate: boolean
  isJoined: boolean
  color: string
}

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'ZK Enthusiasts',
    description: 'Discuss zero-knowledge proofs, cryptography, and privacy tech',
    members: 2340,
    posts: 1289,
    isPrivate: false,
    isJoined: true,
    color: 'from-neon-cyan to-neon-blue',
  },
  {
    id: '2',
    name: 'Aleo Builders',
    description: 'For developers building on the Aleo network',
    members: 1567,
    posts: 892,
    isPrivate: false,
    isJoined: true,
    color: 'from-neon-purple to-neon-pink',
  },
  {
    id: '3',
    name: 'Private Alpha',
    description: 'Exclusive group for early AnoneX adopters',
    members: 150,
    posts: 432,
    isPrivate: true,
    isJoined: false,
    color: 'from-neon-pink to-neon-cyan',
  },
  {
    id: '4',
    name: 'Privacy Advocates',
    description: 'Fighting for digital privacy rights worldwide',
    members: 4521,
    posts: 2341,
    isPrivate: false,
    isJoined: false,
    color: 'from-neon-green to-neon-cyan',
  },
  {
    id: '5',
    name: 'Crypto Research',
    description: 'Academic discussions on cryptographic protocols',
    members: 876,
    posts: 543,
    isPrivate: true,
    isJoined: false,
    color: 'from-yellow-400 to-orange-500',
  },
]

export function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'joined' | 'discover'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')
  const [newGroupPrivate, setNewGroupPrivate] = useState(false)

  const filteredGroups = mockGroups.filter(group => {
    if (filter === 'joined') return group.isJoined
    if (filter === 'discover') return !group.isJoined
    return true
  }).filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Groups</h1>
            <p className="text-white/60">Private communities with ZK membership</p>
          </div>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create Group
        </Button>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search groups..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {(['all', 'joined', 'discover'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                filter === f
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/70'
              )}
            >
              {filter === f && (
                <motion.div
                  layoutId="groupFilter"
                  className="absolute inset-0 rounded-lg bg-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Groups Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="interactive" padding="none" className="overflow-hidden group">
                {/* Banner */}
                <div className={`h-20 bg-gradient-to-r ${group.color} relative`}>
                  <div className="absolute inset-0 bg-black/20" />
                  {group.isPrivate && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="default" className="bg-black/30 backdrop-blur-sm border-white/20">
                        <Lock className="w-3 h-3" />
                        Private
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-neon-cyan transition-colors">
                        {group.name}
                      </h3>
                      <p className="text-sm text-white/50 line-clamp-2 mt-1">
                        {group.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors shrink-0" />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {group.members.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {group.posts.toLocaleString()} posts
                    </span>
                  </div>

                  {/* Action */}
                  {group.isJoined ? (
                    <Badge variant="success" className="w-full justify-center py-2">
                      <Shield className="w-3 h-3" />
                      Member
                    </Badge>
                  ) : (
                    <Button variant="secondary" size="sm" className="w-full">
                      {group.isPrivate ? 'Request to Join' : 'Join Group'}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredGroups.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Sparkles className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No groups found matching your search.</p>
        </motion.div>
      )}

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Group"
        description="Create a private community with ZK membership proofs"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Group Name"
            placeholder="Enter group name..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          
          <Textarea
            label="Description"
            placeholder="What is this group about?"
            value={newGroupDesc}
            onChange={(e) => setNewGroupDesc(e.target.value)}
          />

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              {newGroupPrivate ? (
                <Lock className="w-5 h-5 text-neon-purple" />
              ) : (
                <Globe className="w-5 h-5 text-neon-green" />
              )}
              <div>
                <p className="font-medium text-white text-sm">
                  {newGroupPrivate ? 'Private Group' : 'Public Group'}
                </p>
                <p className="text-xs text-white/50">
                  {newGroupPrivate 
                    ? 'Members need approval to join' 
                    : 'Anyone can join this group'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNewGroupPrivate(!newGroupPrivate)}
              className={cn(
                'relative w-12 h-6 rounded-full transition-colors',
                newGroupPrivate ? 'bg-neon-purple' : 'bg-white/20'
              )}
            >
              <motion.div
                layout
                className="absolute top-1 w-4 h-4 rounded-full bg-white"
                animate={{ left: newGroupPrivate ? '1.5rem' : '0.25rem' }}
              />
            </button>
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
            <Shield className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
            <p className="text-xs text-white/60">
              Group membership is verified using zero-knowledge proofs on Aleo.
              Members can prove they belong without revealing their identity.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowCreateModal(false)}
              disabled={!newGroupName.trim()}
              className="flex-1"
            >
              Create Group
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
