# 🔐 AnoneX - Privacy-First Anonymous Social Platform

<div align="center">
  <img src="frontend/public/favicon.svg" alt="AnoneX Logo" width="120" />
  
  **The future of anonymous social networking, powered by Aleo's zero-knowledge proofs.**
  
  [![Aleo](https://img.shields.io/badge/Built%20on-Aleo-00f5ff?style=for-the-badge)](https://aleo.org)
  [![Leo](https://img.shields.io/badge/Smart%20Contracts-Leo-8b5cf6?style=for-the-badge)](https://leo-lang.org)
  [![React](https://img.shields.io/badge/Frontend-React-61dafb?style=for-the-badge)](https://react.dev)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</div>

---

## 🌟 Overview

AnoneX is a privacy-first anonymous social platform built on the Aleo blockchain. It leverages zero-knowledge proofs to enable users to post, interact, and connect without revealing their identity while still proving they are legitimate users.

### Key Features

- **🔒 True Anonymity** - Post and interact without revealing your identity
- **✅ ZK Verification** - Prove attributes (age, membership) without exposing data
- **🌐 Decentralized** - All data is stored on Aleo blockchain and IPFS
- **🛡️ Privacy by Default** - End-to-end encryption for all content
- **👥 Private Groups** - Create encrypted communities with ZK membership proofs
- **⚡ Fast & Modern** - Beautiful UI with smooth animations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/TypeScript)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  UI Components│  │  Aleo SDK    │  │  IPFS Client │     │
│  │  & Pages     │  │  Integration │  │  Integration │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Aleo Blockchain (Leo Programs)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Post    │  │ Reaction │  │  Follow  │  │  Group   │  │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Off-Chain Storage (IPFS)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Encrypted│  │  Images  │  │  Metadata│                 │
│  │  Content │  │  & Media │  │  Cache   │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [Leo CLI](https://docs.leo-lang.org/) (for smart contracts)
- [Aleo Wallet](https://aleo.org/wallet) (browser extension)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/anonex.git
cd anonex

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the `frontend` directory:

```env
VITE_ALEO_NETWORK=testnet
VITE_ALEO_RPC_URL=https://api.explorer.aleo.org/v1/testnet3
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

---

## 🌐 Deployment

### GitHub

The project is hosted at **https://github.com/Adityasingh2824/AnoneX**. To push updates:

```bash
git add -A
git commit -m "Your message"
git push origin main
```

### Vercel (Frontend)

1. **Connect the repo**
   - Go to [vercel.com](https://vercel.com) and sign in (use “Continue with GitHub”).
   - Click **Add New…** → **Project**.
   - Import **Adityasingh2824/AnoneX** from GitHub.

2. **Configure the build** (monorepo)
   - **Root Directory:** Leave as `.` (repo root). The repo’s `vercel.json` is set to build the frontend and use `frontend/dist` as the output.
   - Or set **Root Directory** to `frontend` and leave **Build Command** and **Output Directory** as default (Vite will be auto-detected).

3. **Environment variables** (optional)
   - In the Vercel project → **Settings** → **Environment Variables**, add any `VITE_*` vars your app needs (e.g. `VITE_ALEO_NETWORK`, `VITE_ALEO_RPC_URL`, `VITE_IPFS_GATEWAY`).

4. **Deploy**
   - Click **Deploy**. Every push to `main` will trigger a new deployment.

---

## 📁 Project Structure

```
AnoneX/
├── contracts/                 # Leo smart contracts
│   └── programs/
│       ├── post/             # Post publishing module
│       ├── reaction/         # Upvotes and reactions
│       ├── follow/           # Follow/subscription system
│       ├── group/            # Private groups
│       └── identity/         # Pseudonym & zPass integration
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # Aleo & IPFS services
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # State management
│   │   └── types/            # TypeScript types
│   └── ...
│
├── scripts/                   # Deployment scripts
└── docs/                      # Documentation
```

---

## 🔧 Smart Contracts

### Post Module (`anonex_post.aleo`)

Manages anonymous post publishing with ZK proofs.

```leo
// Publish a new anonymous post
async transition publish_post(
    content_cid: field,
    timestamp: u64,
    nonce: field
) -> (PostOwnership, Future)
```

### Reaction Module (`anonex_reaction.aleo`)

Handles upvotes with double-vote prevention.

```leo
// Add a reaction to a post
async transition add_reaction(
    post_id: field,
    reaction_type: u8,
    timestamp: u64
) -> (ReactionReceipt, Future)
```

### Follow Module (`anonex_follow.aleo`)

Anonymous follow/subscription system.

```leo
// Follow a user by their pseudonym hash
async transition follow_user(
    target_user_hash: field,
    timestamp: u64
) -> (FollowRecord, Future)
```

### Group Module (`anonex_group.aleo`)

Private groups with ZK membership proofs.

```leo
// Create a new private group
async transition create_group(
    name_hash: field,
    nonce: field,
    secret: field,
    timestamp: u64
) -> (GroupOwnership, GroupMembership, Future)
```

---

## 🎨 Features

### For Users

- **Anonymous Posting** - Share thoughts without identity exposure
- **ZK Reactions** - Like and interact privately
- **Private Groups** - Join encrypted communities
- **Profile Pseudonyms** - Unique anonymous identities
- **Attribute Verification** - Prove age/membership via zPass

### For Developers

- **TypeScript** - Full type safety
- **React 18** - Modern React features
- **Framer Motion** - Smooth animations
- **Zustand** - Simple state management
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast development

---

## 📖 Resources

- [Aleo Developer Documentation](https://developer.aleo.org/)
- [Leo Language Documentation](https://docs.leo-lang.org/leo)
- [Leo Playground](https://play.leo-lang.org/)
- [Aleo Faucet](https://faucet.aleo.org/) (for testnet tokens)

---

## 🛣️ Roadmap

### Wave 2 - MVP ✅
- [x] Core Leo contracts
- [x] Basic post publishing
- [x] Wallet integration
- [x] Feed display

### Wave 3 - Features
- [ ] Reactions & likes
- [ ] Follow system
- [ ] Profile pages
- [ ] Delegated proving

### Final Wave
- [ ] Private groups
- [ ] Direct messages
- [ ] zPass integration
- [ ] Mainnet deployment

### Long-term
- [ ] Mobile app
- [ ] Rich media support
- [ ] DAO governance
- [ ] Cross-chain bridges

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Aleo](https://aleo.org) - For the amazing privacy-focused blockchain
- [Provable](https://provable.xyz) - For the SDK and tools
- The entire Aleo community for support and inspiration

---

<div align="center">
  <strong>Built with 💜 for the Aleo Buildathon</strong>
  
  [Website](https://anonex.io) · [Twitter](https://twitter.com/anonex) · [Discord](https://discord.gg/anonex)
</div>
