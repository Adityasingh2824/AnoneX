# Wave 2 - MVP Implementation Guide

## Overview

Wave 2 focuses on delivering a Minimum Viable Product (MVP) for AnoneX with core anonymous posting functionality.

## Goals

- ✅ Implement core Leo smart contracts
- ✅ Build basic React frontend
- ✅ Integrate Aleo wallet connection
- ✅ Enable anonymous post publishing
- ✅ Display posts in a feed

## Deliverables

### Smart Contracts

1. **Post Module** (`anonex_post.aleo`)
   - `publish_post` - Create new anonymous post
   - `edit_post` - Edit existing post
   - `delete_post` - Soft delete post
   - Mappings for post storage

2. **Identity Module** (`anonex_identity.aleo`)
   - `create_identity` - Generate pseudonym
   - Profile storage

### Frontend

1. **Core Pages**
   - Home page with feed
   - Create post page
   - Basic profile page

2. **Components**
   - Post card with content display
   - Post creation form
   - Wallet connect button
   - Navigation layout

3. **Services**
   - Aleo client wrapper
   - IPFS upload/download
   - Content encryption

## Implementation Steps

### Week 1: Contracts & Setup

1. Set up Leo development environment
2. Implement post.leo contract
3. Implement identity.leo contract
4. Write unit tests
5. Deploy to testnet

### Week 2: Frontend & Integration

1. Set up React project with Vite
2. Build UI components
3. Integrate Aleo SDK
4. Connect wallet adapter
5. Implement IPFS storage
6. End-to-end testing

## Testing Checklist

- [ ] Post creation works
- [ ] Posts appear in feed
- [ ] Wallet connects properly
- [ ] Content encrypts/decrypts
- [ ] UI is responsive
- [ ] Animations are smooth

## Demo Flow

1. User visits AnoneX
2. Connects Aleo wallet
3. Gets assigned pseudonym
4. Creates a post
5. Post appears in feed
6. Other users can view

## Resources

- [Aleo SDK Documentation](https://developer.aleo.org/)
- [Leo Language Guide](https://docs.leo-lang.org/)
- [Testnet Faucet](https://faucet.aleo.org/)
