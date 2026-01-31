import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Shield, Zap, Lock, ExternalLink, AlertCircle, Info, CheckCircle2 } from 'lucide-react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { useWallet } from './WalletProvider'
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui'

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

const features = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted and only you control it',
    color: 'text-neon-cyan',
    bgColor: 'from-neon-cyan/20 to-neon-cyan/5',
  },
  {
    icon: Lock,
    title: 'Anonymous Identity',
    description: 'No KYC required, use a pseudonym',
    color: 'text-neon-purple',
    bgColor: 'from-neon-purple/20 to-neon-purple/5',
  },
  {
    icon: Zap,
    title: 'Zero Knowledge',
    description: "Powered by Aleo's ZK proofs",
    color: 'text-neon-pink',
    bgColor: 'from-neon-pink/20 to-neon-pink/5',
  },
]

const walletInfo = [
  {
    name: 'Leo Wallet',
    icon: '🦁',
    description: 'The most popular Aleo wallet',
    url: 'https://leo.app/',
    recommended: true,
    extensionUrl: 'https://chrome.google.com/webstore/detail/leo-wallet/',
  },
  {
    name: 'Puzzle Wallet',
    icon: '🧩',
    description: 'Earn on Aleo with Arcade rewards',
    url: 'https://puzzle.online/wallet',
    recommended: false,
    extensionUrl: 'https://puzzle.online/wallet',
  },
]

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { connect, isConnecting, isConnected, isDemoMode, availableWallets, error } = useWallet()

  // Close modal when connected
  useEffect(() => {
    if (isConnected && isOpen && !isDemoMode) {
      // Small delay to show success state
      const timer = setTimeout(() => {
        onClose()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isConnected, isOpen, onClose, isDemoMode])


  const hasInstalledWallets = availableWallets.some(w => w.ready)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect to AnoneX"
      description="Connect your Aleo wallet to start posting anonymously"
      size="md"
    >
      <div className="space-y-6">
        {/* Success State */}
        {isConnected && !isDemoMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/20"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-neon-green" />
              <div>
                <p className="font-medium text-white text-sm">Wallet Connected!</p>
                <p className="text-xs text-white/60">You're ready to use AnoneX</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="font-medium text-white text-sm">Connection Error</p>
                <p className="text-xs text-red-300">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features */}
        <div className="grid gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.bgColor} flex items-center justify-center`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <div>
                <p className="font-medium text-white text-sm">{feature.title}</p>
                <p className="text-xs text-white/50">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Wallet Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-white/80">Available Wallets</p>
          <div className="space-y-2">
            {walletInfo.map((wallet, index) => {
              const isInstalled = availableWallets.some(w => 
                w.name.toLowerCase().includes(wallet.name.toLowerCase().split(' ')[0].toLowerCase())
              )
              
              return (
                <motion.a
                  key={wallet.name}
                  href={wallet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group"
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white group-hover:text-neon-cyan transition-colors">
                        {wallet.name}
                      </p>
                      {wallet.recommended && (
                        <Badge variant="primary" className="text-[9px]">Recommended</Badge>
                      )}
                      {isInstalled && (
                        <Badge variant="success" className="text-[9px]">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Installed
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-white/50">{wallet.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60" />
                </motion.a>
              )
            })}
          </div>
        </div>

        {/* Native Wallet Button (Hidden but functional) */}
        <div className="hidden">
          <WalletMultiButton />
        </div>

        {/* Connect Button */}
        <div className="space-y-2">
          {hasInstalledWallets ? (
            <div className="relative">
              {/* Trigger native wallet modal */}
              <Button
                onClick={() => {
                  // Trigger the native wallet modal
                  const button = document.querySelector('[data-testid="wallet-multi-button"]') as HTMLElement
                  if (button) {
                    button.click()
                  } else {
                    // Fallback: try to connect to first available wallet
                    const firstWallet = availableWallets.find(w => w.ready)
                    if (firstWallet) {
                      connect(firstWallet.name as any)
                    }
                  }
                }}
                loading={isConnecting}
                icon={<Wallet className="w-5 h-5" />}
                size="lg"
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white text-sm">No Wallet Detected</p>
                  <p className="text-xs text-white/60 mt-1">
                    Please install Leo Wallet or Puzzle Wallet to continue.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Demo Mode Option */}
          <Button
            onClick={() => connect()}
            loading={isConnecting}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Try Demo Mode'}
          </Button>
        </div>

        {/* Terms */}
        <p className="text-xs text-white/40 text-center">
          By connecting, you agree to our{' '}
          <a href="#" className="text-neon-cyan hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-neon-cyan hover:underline">Privacy Policy</a>
        </p>
      </div>
    </Modal>
  )
}
