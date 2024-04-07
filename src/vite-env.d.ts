/// <reference types="vite/client" />

interface Window {
    ethereum: any
}

interface ImportMetaEnv {
    readonly VITE_MFT_CONTRACT_ADDRESS: string
    readonly VITE_GAME_CONTRACT_ADDRESS: string
}