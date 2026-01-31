import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  LogOut, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronDown,
  Shield,
  Zap,
  RefreshCw,
  FlaskConical,
  AlertCircle
} from 'lucide-react'
import { useWallet } from './WalletProvider'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'

// Custom styled wallet button that wraps the Aleo wallet adapter
export function WalletButton() {
  const { 
    isConnected, 
    address, 
    pseudonym, 
    isConnecting, 
    connect, 
    disconnect,
    isDemoMode,
    walletName,
    error
  } = useWallet()
  
  const [showDropdown, setShowDropdown] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const copyAddress = useCallback(async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [address])

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`
  }

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    // Simulate refresh - in production this would fetch balance/records
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }, [])

  // If not connected, show connect button
  if (!isConnected) {
    return (
      <Button
        onClick={() => connect()}
        loading={isConnecting}
        icon={<Wallet className="w-4 h-4" />}
        size="md"
      >
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </Button>
    )
  }

  // Connected state - show custom dropdown
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
      >
        <Avatar pseudonym={pseudonym || undefined} size="sm" verified={!isDemoMode} />
        <div className="hidden sm:block text-left">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-white">{pseudonym}</p>
            {isDemoMode ? (
              <Badge variant="warning" className="text-[9px] px-1 py-0">
                <FlaskConical className="w-2 h-2" />
                Demo
              </Badge>
            ) : (
              <Badge variant="success" className="text-[9px] px-1 py-0">
                <Zap className="w-2 h-2" />
                Live
              </Badge>
            )}
          </div>
          <p className="text-xs text-white/50 font-mono">{truncateAddress(address!)}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDropdown(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 z-50 rounded-2xl bg-void-950/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5 bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5">
                <div className="flex items-center gap-3">
                  <Avatar pseudonym={pseudonym || undefined} size="lg" showRing verified={!isDemoMode} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{pseudonym}</p>
                      {isDemoMode ? (
                        <Badge variant="warning" className="text-[9px]">
                          <FlaskConical className="w-2.5 h-2.5" />
                          Demo Mode
                        </Badge>
                      ) : (
                        <Badge variant="primary" className="text-[9px]">
                          <Shield className="w-2.5 h-2.5" />
                          ZK Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-white/50 font-mono">{truncateAddress(address!)}</p>
                      <button
                        onClick={copyAddress}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-3 h-3 text-neon-green" />
                        ) : (
                          <Copy className="w-3 h-3 text-white/50 hover:text-white/80" />
                        )}
                      </button>
                    </div>
                    {walletName && !isDemoMode && (
                      <p className="text-[10px] text-white/40 mt-1">Connected via {walletName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="px-4 py-3 bg-red-500/10 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-xs text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {/* Balance Section */}
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-white/50">Balance</p>
                  <button
                    onClick={handleRefresh}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-3 h-3 text-white/50 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-2xl font-display font-bold gradient-text">0.00 ALEO</p>
                <p className="text-xs text-white/40 mt-1">≈ $0.00 USD</p>
              </div>

              {/* Network Info */}
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-yellow-400' : 'bg-neon-green'} animate-pulse`} />
                    <span className="text-sm text-white/70">
                      {isDemoMode ? 'Demo Mode' : 'Aleo Testnet'}
                    </span>
                  </div>
                  <Badge variant={isDemoMode ? 'warning' : 'success'} className="text-[10px]">
                    {isDemoMode ? 'Simulated' : 'Connected'}
                  </Badge>
                </div>
              </div>

              {/* Demo Mode Warning */}
              {isDemoMode && (
                <div className="px-4 py-3 bg-yellow-500/10 border-b border-white/5">
                  <p className="text-xs text-yellow-300">
                    🧪 Demo mode - transactions are simulated locally. Install a wallet for real transactions.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="p-2">
                <motion.a
                  whileHover={{ x: 4 }}
                  href={`https://explorer.aleo.org/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">View on Explorer</span>
                </motion.a>

                {isDemoMode && (
                  <motion.a
                    whileHover={{ x: 4 }}
                    href="https://puzzle.online/wallet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="text-lg">🧩</span>
                    <span className="text-sm">Get Puzzle Wallet</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                )}

                <motion.a
                  whileHover={{ x: 4 }}
                  href="https://faucet.aleo.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Get Testnet Credits</span>
                </motion.a>
                
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    disconnect()
                    setShowDropdown(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Disconnect</span>
                </motion.button>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-white/[0.02] border-t border-white/5">
                <p className="text-[10px] text-white/30 text-center">
                  {isDemoMode 
                    ? 'Demo Mode • Install a wallet for real transactions'
                    : `Powered by ${walletName || 'Aleo'} • Privacy First`
                  }
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact wallet button for mobile/smaller spaces
export function WalletButtonCompact() {
  const { isConnected, pseudonym, isConnecting, connect } = useWallet()

  if (!isConnected) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => connect()}
        disabled={isConnecting}
        className="p-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white"
      >
        <Wallet className="w-5 h-5" />
      </motion.button>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
    >
      <Avatar pseudonym={pseudonym || undefined} size="xs" />
      <span className="text-sm font-medium text-white">{pseudonym?.slice(0, 8)}...</span>
    </motion.div>
  )
}
