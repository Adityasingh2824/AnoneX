# AnoneX Leo Smart Contracts

This directory contains the Leo smart contracts for AnoneX - a privacy-first anonymous social platform on Aleo.

## Programs

### Core Modules

- **`post.leo`** - Post publishing, editing, and deletion
- **`reaction.leo`** - Upvotes and reactions with double-vote prevention
- **`follow.leo`** - Anonymous follow/subscription system
- **`group.leo`** - Private group/channel management
- **`identity.leo`** - Pseudonym generation and zPass integration

## Prerequisites

1. Install Leo CLI:
```bash
curl -sSf https://raw.githubusercontent.com/AleoHQ/leo/mainnet/install.sh | sh
```

2. Verify installation:
```bash
leo --version
```

## Building

Build all programs:
```bash
leo build
```

## Testing

Run tests:
```bash
leo test
```

## Deployment

Deploy to testnet:
```bash
leo deploy --network testnet
```

## Program Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   post.leo      │     │  reaction.leo   │
│                 │◄────│                 │
│ - publish_post  │     │ - add_reaction  │
│ - edit_post     │     │ - remove_react  │
│ - delete_post   │     └─────────────────┘
└─────────────────┘
        │
        ▼
┌─────────────────┐     ┌─────────────────┐
│   follow.leo    │     │   group.leo     │
│                 │     │                 │
│ - follow_user   │     │ - create_group  │
│ - unfollow_user │     │ - join_group    │
│ - get_following │     │ - post_in_group │
└─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│  identity.leo   │
│                 │
│ - gen_pseudonym │
│ - verify_attr   │
└─────────────────┘
```

## Resources

- [Leo Documentation](https://docs.leo-lang.org/leo)
- [Aleo Developer Docs](https://developer.aleo.org/)
- [Leo Playground](https://play.leo-lang.org/)
