/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALEO_NETWORK: string
  readonly VITE_ALEO_RPC_URL: string
  readonly VITE_PROVABLE_API_URL: string
  readonly VITE_POST_PROGRAM_ID: string
  readonly VITE_REACTION_PROGRAM_ID: string
  readonly VITE_FOLLOW_PROGRAM_ID: string
  readonly VITE_GROUP_PROGRAM_ID: string
  readonly VITE_IDENTITY_PROGRAM_ID: string
  readonly VITE_IPFS_GATEWAY: string
  readonly VITE_IPFS_API_URL: string
  readonly VITE_IPFS_PROJECT_ID: string
  readonly VITE_IPFS_PROJECT_SECRET: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
