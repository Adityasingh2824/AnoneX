import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PenSquare, 
  Image, 
  Hash, 
  AtSign, 
  Globe, 
  Lock, 
  Users, 
  Send,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Avatar } from '../components/common/Avatar'
import { useWallet } from '../components/wallet/WalletProvider'
import { TransactionStatus } from '../components/wallet/TransactionStatus'
import { usePublishPost } from '../hooks/useAleoTransaction'
import { ipfsClient } from '../services/ipfs/client'
import { hashContent } from '../services/ipfs/encryption'
import { cn } from '@/utils/cn'

type Visibility = 'public' | 'private' | 'group'

export function CreatePostPage() {
  const navigate = useNavigate()
  const { isConnected, pseudonym, connect } = useWallet()
  const { publishPost, status, transactionId, error, reset, isLoading } = usePublishPost()
  
  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('public')
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  const maxLength = 500
  const remainingChars = maxLength - content.length

  const visibilityOptions = [
    { id: 'public' as const, label: 'Public', icon: Globe, description: 'Visible to everyone' },
    { id: 'private' as const, label: 'Private', icon: Lock, description: 'Only you can see' },
    { id: 'group' as const, label: 'Group', icon: Users, description: 'Share with a group' },
  ]

  const handleSubmit = async () => {
    if (!content.trim() || isLoading) return

    try {
      // Step 1: Upload content to IPFS
      setUploadProgress('Uploading to IPFS...')
      const ipfsResult = await ipfsClient.uploadJSON({
        content,
        visibility,
        timestamp: Date.now(),
        version: '1.0',
      })

      // Step 2: Generate content hash for on-chain storage
      setUploadProgress('Generating content hash...')
      const contentHash = await hashContent(ipfsResult.cid)

      // Step 3: Submit transaction to Aleo network
      setUploadProgress(null)
      await publishPost(contentHash)

      // Show success
      setShowSuccess(true)
      
      // Navigate after delay
      setTimeout(() => {
        navigate('/')
      }, 3000)

    } catch (err) {
      console.error('Failed to publish post:', err)
      setUploadProgress(null)
    }
  }

  const handleClose = () => {
    reset()
    if (status === 'confirmed') {
      navigate('/')
    }
  }

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card padding="lg" className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
            <Lock className="w-10 h-10 text-neon-cyan" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-3">
            Connect to Create
          </h2>
          <p className="text-white/60 mb-6 max-w-sm mx-auto">
            Connect your Aleo wallet to start creating anonymous posts with zero-knowledge proofs.
          </p>
          <Button onClick={() => connect()} size="lg">
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
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
          <PenSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Create Post</h1>
          <p className="text-white/60">Share your thoughts anonymously on Aleo</p>
        </div>
      </motion.div>

      {/* Success State */}
      <AnimatePresence>
        {showSuccess && status === 'confirmed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-void-950/90 backdrop-blur-sm"
          >
            <Card padding="lg" className="text-center max-w-md mx-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-neon-green" />
              </motion.div>
              <h2 className="font-display font-bold text-2xl text-white mb-3">
                Post Published!
              </h2>
              <p className="text-white/60 mb-4">
                Your anonymous post has been verified with ZK proofs and published to the Aleo network.
              </p>
              {transactionId && (
                <a
                  href={`https://explorer.aleo.org/transaction/${transactionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neon-cyan hover:underline"
                >
                  View Transaction →
                </a>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Status */}
      <TransactionStatus
        status={status}
        transactionId={transactionId}
        error={error}
        onClose={handleClose}
        onRetry={handleSubmit}
      />

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card padding="lg" className="space-y-6">
          {/* Author Info */}
          <div className="flex items-center gap-4 pb-4 border-b border-white/5">
            <Avatar pseudonym={pseudonym || undefined} size="lg" verified />
            <div>
              <p className="font-medium text-white">{pseudonym}</p>
              <p className="text-sm text-white/50">Posting anonymously via ZK proof</p>
            </div>
          </div>

          {/* Content Input */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share your thoughts anonymously..."
              rows={6}
              disabled={isLoading}
              className="w-full bg-transparent text-white text-lg placeholder-white/30 resize-none focus:outline-none leading-relaxed disabled:opacity-50"
              maxLength={maxLength + 50}
            />
            
            {/* Character counter */}
            <div className="absolute bottom-0 right-0">
              <span className={cn(
                'text-sm font-mono transition-colors',
                remainingChars < 0
                  ? 'text-red-400'
                  : remainingChars < 50
                  ? 'text-yellow-400'
                  : 'text-white/30'
              )}>
                {remainingChars}
              </span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 pt-4 border-t border-white/5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isLoading}
              className="p-3 rounded-xl text-white/40 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors disabled:opacity-50"
              title="Add image"
            >
              <Image className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isLoading}
              className="p-3 rounded-xl text-white/40 hover:text-neon-purple hover:bg-neon-purple/10 transition-colors disabled:opacity-50"
              title="Add hashtag"
            >
              <Hash className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isLoading}
              className="p-3 rounded-xl text-white/40 hover:text-neon-pink hover:bg-neon-pink/10 transition-colors disabled:opacity-50"
              title="Mention"
            >
              <AtSign className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Visibility Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white/80">Visibility</label>
            <div className="grid grid-cols-3 gap-3">
              {visibilityOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setVisibility(option.id)}
                  disabled={isLoading}
                  className={cn(
                    'relative p-4 rounded-xl border transition-all duration-300 text-left disabled:opacity-50',
                    visibility === option.id
                      ? 'bg-white/10 border-neon-cyan/50'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  )}
                >
                  {visibility === option.id && (
                    <motion.div
                      layoutId="visibilityIndicator"
                      className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-cyan"
                    />
                  )}
                  <option.icon className={cn(
                    'w-5 h-5 mb-2 transition-colors',
                    visibility === option.id ? 'text-neon-cyan' : 'text-white/40'
                  )} />
                  <p className="font-medium text-white text-sm">{option.label}</p>
                  <p className="text-xs text-white/40">{option.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Privacy Info */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
            <Shield className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white text-sm">Privacy Protected by ZK Proofs</p>
              <p className="text-xs text-white/50 mt-1">
                Your post will be verified using zero-knowledge proofs on Aleo.
                Your identity remains anonymous while proving you're a valid user.
                Content is stored on IPFS with the hash recorded on-chain.
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3 p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="w-5 h-5 text-neon-purple" />
              </motion.div>
              <span className="text-sm text-white/80">{uploadProgress}</span>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-300">{error}</span>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={() => navigate(-1)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || remainingChars < 0 || isLoading}
              loading={isLoading}
              icon={isLoading ? <Zap className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              iconPosition="right"
              size="lg"
            >
              {status === 'preparing' ? 'Generating ZK Proof...' : 
               status === 'signing' ? 'Sign in Wallet...' :
               status === 'broadcasting' ? 'Broadcasting...' :
               status === 'confirming' ? 'Confirming...' :
               'Publish Post'}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card padding="md" className="bg-white/[0.02]">
          <h3 className="font-medium text-white mb-3">How it Works</h3>
          <ol className="space-y-2 text-sm text-white/50">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-neon-cyan/20 text-neon-cyan text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Your content is encrypted and uploaded to IPFS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-neon-purple/20 text-neon-purple text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>A zero-knowledge proof is generated to verify your post</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-neon-pink/20 text-neon-pink text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>The proof is recorded on Aleo blockchain - your identity stays hidden</span>
            </li>
          </ol>
        </Card>
      </motion.div>
    </motion.div>
  )
}
