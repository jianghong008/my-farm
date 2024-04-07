import { Contract } from "ethers";
import { Wallet } from "./wallet";

export class GameContract {
    public static contract: Contract
    public static unitScale = 10000
    public static cowFeeding = 3600 * 12;
    public static treeFeeding = 3600 * 8;
    static async loadContract() {
        GameContract.contract = await Wallet.getGameContract()
    }
    static async newUser() {
        const tx = await GameContract.contract.newUser()
        await tx.wait()
    }

    static async getInfo(): Promise<User> {
        const info = await GameContract.contract.getInfo()
        return JSON.parse(info)
    }

    static async getManure(): Promise<number[]> {
        return await GameContract.contract.getManure()
    }

    static async getFruits(): Promise<number[]> {
        return await GameContract.contract.getFruits()
    }

    static async claimManure() {
        const tx = await GameContract.contract.claimManure()
        await tx.wait()
    }

    static async claimFruits() {
        return await GameContract.contract.claimFruits()
    }

    static async manureTree() {
        return await GameContract.contract.manureTree()
    }

    static async feedCow() {
        return await GameContract.contract.feedCow()
    }
}