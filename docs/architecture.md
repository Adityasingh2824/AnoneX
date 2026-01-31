# AnoneX Architecture Documentation

## Overview

AnoneX is a privacy-first anonymous social platform built on Aleo blockchain. This document describes the technical architecture and design decisions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User's Browser                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    React Frontend                            │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │   │
│  │  │   UI    │  │  State  │  │  Hooks  │  │ Services │       │   │
│  │  │Components│  │ (Zustand)│  │         │  │         │       │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   Aleo Wallet Adapter                        │   │
│  │  • Account Management     • Transaction Signing              │   │
│  │  • Key Storage            • Network Connection               │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      External Services                              │
│  ┌─────────────────────┐      ┌─────────────────────┐             │
│  │   Aleo Network      │      │      IPFS           │             │
│  │                     │      │                     │             │
│  │  • Leo Programs     │      │  • Content Storage  │             │
│  │  • ZK Proofs        │      │  • Encrypted Data   │             │
│  │  • State Mappings   │      │  • Media Files      │             │
│  │  • Records          │      │                     │             │
│  └─────────────────────┘      └─────────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

## Smart Contract Architecture

### Program Modules

1. **Identity Module** (`anonex_identity.aleo`)
   - Pseudonym generation
   - Profile management
   - zPass attribute verification
   
2. **Post Module** (`anonex_post.aleo`)
   - Post publishing with ZK proofs
   - Content hash storage
   - Edit and delete operations

3. **Reaction Module** (`anonex_reaction.aleo`)
   - Like/reaction management
   - Double-vote prevention
   - Reaction counts

4. **Follow Module** (`anonex_follow.aleo`)
   - Anonymous following
   - Follower/following counts
   - Relationship tracking

5. **Group Module** (`anonex_group.aleo`)
   - Private group creation
   - ZK membership proofs
   - Group encryption keys

### Data Flow

```
User Action → Frontend → Aleo SDK → ZK Proof Generation → Transaction → Aleo Network
                                                                            │
                                                                            ▼
                                                                    State Update
                                                                            │
                                                                            ▼
                                                                    Event Emission
                                                                            │
                                                                            ▼
                                                                    Frontend Update
```

## Privacy Model

### On-Chain Privacy

- **Records**: Private data stored as encrypted Aleo records
- **Mappings**: Public state for aggregate data (counts, etc.)
- **Proofs**: ZK proofs verify actions without revealing identity

### Off-Chain Privacy

- **Content Encryption**: AES-256-GCM encryption before IPFS upload
- **Key Management**: User-controlled encryption keys
- **Content Addressing**: Only hashes stored on-chain

### Identity Privacy

- **Pseudonyms**: Unique identifiers derived from addresses
- **No KYC**: No personal information required
- **zPass**: Optional attribute verification without identity exposure

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   ├── post/            # Post-related components
│   ├── wallet/          # Wallet integration
│   └── ...
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── services/            # API and blockchain services
├── store/               # State management
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

### State Management

- **Zustand**: Lightweight state management
- **React Query**: Server state and caching
- **Local Storage**: Persisted settings

### Styling

- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animations
- **Custom Theme**: Cyberpunk/privacy aesthetic

## Security Considerations

1. **Key Security**: Private keys never leave the user's wallet
2. **Content Integrity**: Hashes verify content authenticity
3. **Replay Protection**: Nonces prevent transaction replay
4. **Double Actions**: Record serial numbers prevent duplicates

## Performance Optimizations

1. **Delegated Proving**: Offload proof generation to Aleo network
2. **IPFS Caching**: Gateway caching for content
3. **Lazy Loading**: Components loaded on demand
4. **Optimistic Updates**: UI updates before confirmation

## Deployment

### Testnet Deployment

```bash
# Set environment
export ALEO_NETWORK=testnet
export ALEO_PRIVATE_KEY="APrivateKey1..."

# Deploy contracts
npm run deploy:contracts

# Start frontend
npm run dev
```

### Mainnet Deployment

1. Audit smart contracts
2. Test thoroughly on testnet
3. Deploy to mainnet
4. Monitor for issues

## Future Improvements

1. **Layer 2 Scaling**: Batch transactions
2. **Cross-Chain**: Bridge to other networks
3. **Mobile**: React Native app
4. **AI Moderation**: Privacy-preserving content moderation
