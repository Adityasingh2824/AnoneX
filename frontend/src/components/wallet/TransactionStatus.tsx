import { motion, AnimatePresence } from 'framer-motion'
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Wallet,
  Send,
  Shield,
  Clock
} from 'lucide-react'
import { Button } from '../common/Button'

type TransactionStatus = 'idle' | 'preparing' | 'signing' | 'broadcasting' | 'confirming' | 'confirmed' | 'failed'

interface TransactionStatusProps {
  status: TransactionStatus
  transactionId: string | null
  error: string | null
  onClose?: () => void
  onRetry?: () => void
}

const statusConfig: Record<TransactionStatus, {
  icon: typeof Loader2
  title: string
  description: string
  color: string
  animate?: boolean
}> = {
  idle: {
    icon: Wallet,
    title: 'Ready',
    description: 'Transaction ready to submit',
    color: 'text-white/50',
  },
  preparing: {
    icon: Shield,
    title: 'Preparing ZK Proof',
    description: 'Generating zero-knowledge proof for your transaction...',
    color: 'text-neon-cyan',
    animate: true,
  },
  signing: {
    icon: Wallet,
    title: 'Waiting for Signature',
    description: 'Please sign the transaction in your wallet...',
    color: 'text-neon-purple',
    animate: true,
  },
  broadcasting: {
    icon: Send,
    title: 'Broadcasting',
    description: 'Sending transaction to the Aleo network...',
    color: 'text-neon-pink',
    animate: true,
  },
  confirming: {
    icon: Clock,
    title: 'Confirming',
    description: 'Waiting for network confirmation...',
    color: 'text-yellow-400',
    animate: true,
  },
  confirmed: {
    icon: CheckCircle2,
    title: 'Confirmed!',
    description: 'Your transaction has been confirmed on the Aleo network.',
    color: 'text-neon-green',
  },
  failed: {
    icon: XCircle,
    title: 'Transaction Failed',
    description: 'Something went wrong. Please try again.',
    color: 'text-red-400',
  },
}

export function TransactionStatus({ 
  status, 
  transactionId, 
  error, 
  onClose, 
  onRetry 
}: TransactionStatusProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  const isLoading = ['preparing', 'signing', 'broadcasting', 'confirming'].includes(status)
  const isComplete = status === 'confirmed' || status === 'failed'

  if (status === 'idle') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 w-80"
    >
      <div className="glass-card p-4 shadow-2xl">
        {/* Status Icon */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${config.color}`}>
            {config.animate ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
            ) : (
              <Icon className="w-6 h-6" />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className={`font-semibold ${config.color}`}>{config.title}</h4>
            <p className="text-sm text-white/60 mt-1">
              {error || config.description}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        {isLoading && (
          <div className="mt-4 flex items-center gap-2">
            {['preparing', 'signing', 'broadcasting', 'confirming'].map((step, index) => {
              const currentIndex = ['preparing', 'signing', 'broadcasting', 'confirming'].indexOf(status)
              const isActive = index === currentIndex
              const isComplete = index < currentIndex
              
              return (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div className={`
                    h-1.5 flex-1 rounded-full transition-all duration-300
                    ${isComplete ? 'bg-neon-cyan' : isActive ? 'bg-neon-cyan/50 animate-pulse' : 'bg-white/10'}
                  `} />
                </div>
              )
            })}
          </div>
        )}

        {/* Transaction ID */}
        {transactionId && status === 'confirmed' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-white/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Transaction ID</span>
              <a
                href={`https://explorer.aleo.org/transaction/${transactionId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-neon-cyan hover:underline"
              >
                {transactionId.slice(0, 8)}...{transactionId.slice(-6)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-white/5 flex gap-2"
          >
            {status === 'failed' && onRetry && (
              <Button variant="secondary" size="sm" onClick={onRetry} className="flex-1">
                Try Again
              </Button>
            )}
            {onClose && (
              <Button 
                variant={status === 'confirmed' ? 'primary' : 'ghost'} 
                size="sm" 
                onClick={onClose}
                className="flex-1"
              >
                {status === 'confirmed' ? 'Done' : 'Close'}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Toast notification for quick transaction updates
interface TransactionToastProps {
  status: TransactionStatus
  transactionId: string | null
}

export function TransactionToast({ status, transactionId }: TransactionToastProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  if (status === 'idle') return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-void-950/95 backdrop-blur-xl border border-white/10 shadow-lg">
          {config.animate ? (
            <Loader2 className={`w-5 h-5 ${config.color} animate-spin`} />
          ) : (
            <Icon className={`w-5 h-5 ${config.color}`} />
          )}
          <span className="text-sm text-white">{config.title}</span>
          {transactionId && status === 'confirmed' && (
            <a
              href={`https://explorer.aleo.org/transaction/${transactionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
