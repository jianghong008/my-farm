import { Contract, ethers, formatEther } from "ethers"
import gameBbi from '../assets/abi/game.json'
import mftBbi from '../assets/abi/mft.json'
export namespace Wallet {
    export function getProvider() {
        return new ethers.BrowserProvider(window.ethereum)
    }
    export const getGameContract = async () => {
        const signer = await getProvider().getSigner()
        return new Contract(import.meta.env.VITE_GAME_CONTRACT_ADDRESS, gameBbi.output.abi, signer)
    }

    export const getMFTContract = async () => {
        const signer = await getProvider().getSigner()
        return new Contract(import.meta.env.VITE_MFT_CONTRACT_ADDRESS, mftBbi.output.abi, signer)
    }

    export const connectWallet = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        return accounts[0]
    }

    export const disconnectWallet = async () => {
        await window.ethereum.request({ method: 'wallet_revokePermissions', params: [{ eth_accounts: {} }] })
    }

    export const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    export const formatBigNumber = (bn: string | bigint, decimal = 4) => {
        return Number(Number(formatEther(bn)).toFixed(decimal))
    }

    export const formatNumber = (num: number, decimal = 4) => {
        return Number(num.toFixed(decimal))
    }
}