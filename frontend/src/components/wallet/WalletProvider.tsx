import { useMemo, createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react'
import { 
  WalletProvider as AleoWalletProvider, 
  useWallet as useAleoWallet 
} from '@demox-labs/aleo-wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { 
  DecryptPermission, 
  WalletAdapterNetwork,
  type Adapter,
  type WalletName,
} from '@demox-labs/aleo-wallet-adapter-base'

// Import wallet adapter styles
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css'

// Extended wallet context with AnoneX-specific functionality
interface AnoneXWalletContextType {
  // Basic wallet state
  isConnected: boolean
  address: string | null
  publicKey: string | null
  pseudonym: string | null
  isConnecting: boolean
  error: string | null
  walletName: string | null
  
  // Wallet functions
  connect: (walletName?: WalletName) => Promise<void>
  disconnect: () => Promise<void>
  
  // Transaction functions
  requestTransaction: (transaction: AleoTransaction) => Promise<string>
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
  decrypt: (ciphertext: string) => Promise<string>
  
  // Aleo-specific
  getRecords: (programId: string) => Promise<unknown[]>
  transactionStatus: (transactionId: string) => Promise<string>
  
  // Demo mode (when no wallet installed)
  isDemoMode: boolean
  
  // Available wallets
  availableWallets: Array<{ name: string; ready: boolean }>
}

// Transaction type
export interface AleoTransaction {
  address: string
  chainId: string
  transitions: AleoTransition[]
  fee: number
  privateFee: boolean
}

export interface AleoTransition {
  program: string
  functionName: string
  inputs: string[]
}

const AnoneXWalletContext = createContext<AnoneXWalletContextType | null>(null)

// Generate pseudonym from address
function generatePseudonym(address: string): string {
  const adjectives = ['Swift', 'Silent', 'Mystic', 'Shadow', 'Cosmic', 'Neon', 'Cipher', 'Phantom', 'Nova', 'Echo', 'Stellar', 'Quantum', 'Void', 'Prime', 'Zero']
  const nouns = ['Fox', 'Wolf', 'Hawk', 'Raven', 'Tiger', 'Dragon', 'Phoenix', 'Serpent', 'Panther', 'Falcon', 'Sage', 'Ghost', 'Knight', 'Nomad', 'Oracle']
  
  const hash = address.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0)
  const adj = adjectives[hash % adjectives.length]
  const noun = nouns[(hash * 7) % nouns.length]
  const num = (hash % 9999) + 1
  
  return `${adj}${noun}${num}`
}

// Generate demo address
function generateDemoAddress(): string {
  return 'aleo1' + Array.from({ length: 58 }, () => 
    'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
  ).join('')
}

// Check if Puzzle Wallet is installed
function isPuzzleWalletInstalled(): boolean {
  if (typeof window === 'undefined') return false
  // Check for Puzzle Wallet extension
  return !!(window as any).puzzle || !!(window as any).puzzleWallet
}

// Inner provider that uses the Aleo wallet hooks
function AnoneXWalletContextProvider({ children }: { children: ReactNode }) {
  const aleoWallet = useAleoWallet()
  
  const [pseudonym, setPseudonym] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [demoAddress, setDemoAddress] = useState<string | null>(null)
  const [demoConnecting, setDemoConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get available wallets
  const availableWallets = useMemo(() => {
    return aleoWallet.wallets.map(w => ({
      name: w.adapter.name,
      ready: w.readyState === 'Installed',
    }))
  }, [aleoWallet.wallets])

  // Check if any real wallet is available
  const hasRealWallet = aleoWallet.wallets.length > 0 && aleoWallet.wallets.some(w => w.readyState === 'Installed')
  const hasPuzzleWallet = isPuzzleWalletInstalled()

  // Determine actual connection state
  const isConnected = demoMode ? !!demoAddress : aleoWallet.connected
  const isConnecting = demoMode ? demoConnecting : aleoWallet.connecting
  const address = demoMode ? demoAddress : aleoWallet.publicKey
  const walletName = demoMode ? 'Demo' : aleoWallet.wallet?.adapter.name || null

  // Update pseudonym when address changes
  useEffect(() => {
    if (address) {
      setPseudonym(generatePseudonym(address))
    } else {
      setPseudonym(null)
    }
  }, [address])

  // Auto-connect if wallet was previously connected
  useEffect(() => {
    if (hasRealWallet && !isConnected && !demoMode && !isConnecting) {
      // Try to reconnect to last used wallet
      const lastWallet = localStorage.getItem('anonex_last_wallet')
      if (lastWallet) {
        const wallet = aleoWallet.wallets.find(w => w.adapter.name === lastWallet && w.readyState === 'Installed')
        if (wallet) {
          connect(lastWallet as WalletName).catch(() => {
            // If auto-connect fails, clear the stored wallet
            localStorage.removeItem('anonex_last_wallet')
          })
        }
      }
    }
  }, [hasRealWallet, isConnected, demoMode, isConnecting])

  const connect = useCallback(async (walletName?: WalletName) => {
    setError(null)
    
    // Try real wallet first if available
    if (hasRealWallet || hasPuzzleWallet) {
      try {
        // If specific wallet name provided, select it first
        if (walletName) {
          aleoWallet.select(walletName)
          // Wait a bit for wallet to initialize
          await new Promise(resolve => setTimeout(resolve, 300))
        } else {
          // Auto-select first available wallet
          const availableWallet = aleoWallet.wallets.find(w => w.readyState === 'Installed')
          if (availableWallet) {
            aleoWallet.select(availableWallet.adapter.name)
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        }

        // Connect with proper parameters
        await aleoWallet.connect(
          DecryptPermission.UponRequest, 
          WalletAdapterNetwork.TestnetBeta,
          ['anonex_post.aleo', 'anonex_reaction.aleo', 'anonex_follow.aleo', 'anonex_group.aleo', 'anonex_identity.aleo']
        )
        
        // Store last used wallet
        if (aleoWallet.wallet?.adapter.name) {
          localStorage.setItem('anonex_last_wallet', aleoWallet.wallet.adapter.name)
        }
        
        setDemoMode(false)
        return
      } catch (err: any) {
        console.error('Failed to connect real wallet:', err)
        setError(err?.message || 'Failed to connect wallet')
        // Fall through to demo mode if user wants
      }
    }

    // Demo mode when no wallet installed or connection failed
    console.log('Using demo mode')
    setDemoConnecting(true)
    setDemoMode(true)
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setDemoAddress(generateDemoAddress())
    setDemoConnecting(false)
  }, [hasRealWallet, hasPuzzleWallet, aleoWallet])

  const disconnect = useCallback(async () => {
    setError(null)
    
    if (demoMode) {
      setDemoAddress(null)
      setDemoMode(false)
    } else {
      try {
        await aleoWallet.disconnect()
        localStorage.removeItem('anonex_last_wallet')
      } catch (err) {
        console.error('Failed to disconnect:', err)
      }
    }
  }, [demoMode, aleoWallet])

  const requestTransaction = useCallback(async (transaction: AleoTransaction): Promise<string> => {
    if (demoMode) {
      // Simulate transaction in demo mode
      console.log('Demo mode transaction:', transaction)
      await new Promise(resolve => setTimeout(resolve, 2000))
      return `at1demo${Math.random().toString(36).substring(2, 15)}`
    }

    if (!aleoWallet.requestTransaction) {
      throw new Error('Wallet does not support transactions')
    }
    
    // Convert to the format expected by the wallet adapter
    // The adapter expects a Transaction object with specific structure
    try {
      const txId = await aleoWallet.requestTransaction(transaction as any)
      return txId
    } catch (err: any) {
      console.error('Transaction error:', err)
      throw new Error(err?.message || 'Transaction failed')
    }
  }, [demoMode, aleoWallet])

  const signMessage = useCallback(async (message: Uint8Array): Promise<Uint8Array> => {
    if (demoMode) {
      // Return mock signature in demo mode
      return new Uint8Array(64).fill(0)
    }

    if (!aleoWallet.signMessage) {
      throw new Error('Wallet does not support message signing')
    }
    return aleoWallet.signMessage(message)
  }, [demoMode, aleoWallet])

  const decrypt = useCallback(async (ciphertext: string): Promise<string> => {
    if (demoMode) {
      // Return mock decryption in demo mode
      return 'demo_decrypted_content'
    }

    if (!aleoWallet.decrypt) {
      throw new Error('Wallet does not support decryption')
    }
    return aleoWallet.decrypt(ciphertext)
  }, [demoMode, aleoWallet])

  const getRecords = useCallback(async (programId: string): Promise<unknown[]> => {
    if (demoMode) {
      // Return empty records in demo mode
      return []
    }

    if (!aleoWallet.requestRecords) {
      throw new Error('Wallet does not support record requests')
    }
    return aleoWallet.requestRecords(programId)
  }, [demoMode, aleoWallet])

  const transactionStatus = useCallback(async (transactionId: string): Promise<string> => {
    if (demoMode) {
      // Simulate confirmed status in demo mode
      await new Promise(resolve => setTimeout(resolve, 500))
      return 'Finalized'
    }

    if (!aleoWallet.transactionStatus) {
      throw new Error('Wallet does not support transaction status')
    }
    return aleoWallet.transactionStatus(transactionId)
  }, [demoMode, aleoWallet])

  const value: AnoneXWalletContextType = {
    isConnected,
    address,
    publicKey: address,
    pseudonym,
    isConnecting,
    error,
    walletName,
    connect,
    disconnect,
    requestTransaction,
    signMessage,
    decrypt,
    getRecords,
    transactionStatus,
    isDemoMode: demoMode,
    availableWallets,
  }

  return (
    <AnoneXWalletContext.Provider value={value}>
      {children}
    </AnoneXWalletContext.Provider>
  )
}

// Main wallet provider component
interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  // Initialize wallet adapters - Leo Wallet is the primary one
  // Puzzle Wallet should be auto-detected if installed
  const wallets = useMemo<Adapter[]>(() => {
    const adapters: Adapter[] = [
      new LeoWalletAdapter({
        appName: 'AnoneX',
      }),
    ]
    
    // Note: Puzzle Wallet should be auto-detected by the adapter system
    // if the browser extension is installed. The adapter will automatically
    // add it to the wallets list.
    
    return adapters
  }, [])

  return (
    <AleoWalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.TestnetBeta}
      autoConnect={false}
    >
      <WalletModalProvider>
        <AnoneXWalletContextProvider>
          {children}
        </AnoneXWalletContextProvider>
      </WalletModalProvider>
    </AleoWalletProvider>
  )
}

// Custom hook to use the AnoneX wallet context
export function useWallet() {
  const context = useContext(AnoneXWalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Export transaction type
export type { AleoTransaction as Transaction, AleoTransition as Transition }

// Export wallet modal button for use in UI
export { WalletMultiButton }
