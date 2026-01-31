import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Image, Hash, AtSign, Smile, Lock, Globe, AlertCircle } from 'lucide-react'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { useWallet } from '../wallet/WalletProvider'
import { cn } from '@/utils/cn'

interface PostFormProps {
  onSubmit: (content: string) => Promise<void>
  placeholder?: string
  maxLength?: number
}

export function PostForm({
  onSubmit,
  placeholder = "What's on your mind? Share anonymously...",
  maxLength = 500,
}: PostFormProps) {
  const { isConnected, pseudonym } = useWallet()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(content)
      setContent('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const remainingChars = maxLength - content.length
  const isOverLimit = remainingChars < 0

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-neon-cyan" />
        </div>
        <h3 className="font-display font-semibold text-lg text-white mb-2">
          Connect to Post
        </h3>
        <p className="text-white/60 text-sm">
          Connect your Aleo wallet to start sharing anonymously
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-card p-5 transition-all duration-500',
        isFocused && 'ring-1 ring-neon-cyan/30 shadow-neon-cyan/10'
      )}
    >
      <div className="flex gap-4">
        <Avatar pseudonym={pseudonym || undefined} size="md" />
        
        <div className="flex-1 space-y-4">
          {/* Text Input */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={3}
              className="w-full bg-transparent text-white placeholder-white/40 resize-none focus:outline-none text-base leading-relaxed"
            />
            
            {/* Character count */}
            <AnimatePresence>
              {content.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-0 right-0"
                >
                  <span className={cn(
                    'text-xs font-mono transition-colors',
                    isOverLimit
                      ? 'text-red-400'
                      : remainingChars < 50
                      ? 'text-yellow-400'
                      : 'text-white/30'
                  )}>
                    {remainingChars}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            {/* Left actions */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-white/40 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                title="Add image"
              >
                <Image className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-white/40 hover:text-neon-purple hover:bg-neon-purple/10 transition-colors"
                title="Add hashtag"
              >
                <Hash className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-white/40 hover:text-neon-pink hover:bg-neon-pink/10 transition-colors"
                title="Mention"
              >
                <AtSign className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-white/40 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                title="Emoji"
              >
                <Smile className="w-5 h-5" />
              </motion.button>

              {/* Visibility toggle */}
              <div className="ml-2 pl-2 border-l border-white/10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setVisibility(v => v === 'public' ? 'private' : 'public')}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors',
                    visibility === 'public'
                      ? 'text-neon-green bg-neon-green/10'
                      : 'text-neon-purple bg-neon-purple/10'
                  )}
                >
                  {visibility === 'public' ? (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Private
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isOverLimit}
              loading={isSubmitting}
              icon={<Send className="w-4 h-4" />}
              iconPosition="right"
              size="md"
            >
              Post
            </Button>
          </div>

          {/* Error state */}
          {isOverLimit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Your post is too long. Please shorten it.</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
