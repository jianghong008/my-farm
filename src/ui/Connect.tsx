import { useContext, useEffect, useState } from "react"
import { Wallet } from "../utils/wallet"
import { UserContext } from "../data/user"
import { GameContract } from "../utils/game"
import { Popup } from "./common/Popup"
export function Connect() {
    const { data, setData } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const connect = async () => {
        const address = await Wallet.connectWallet()
        data.address = address
        data.isConnect = true
        localStorage.setItem('connectAddress', address)
        await GameContract.loadContract()
        try {
            await loadInfo()
        } catch (error) {
            await GameContract.newUser()
            await loadInfo()
        }
    }
    const loadInfo = async () => {
        setLoading(true)
        const info = await GameContract.getInfo()
        setLoading(false)
        data.user = info
        setData({ ...data })
        console.log('info', info)
    }
    useEffect(() => {
        if (data.isConnect) {
            return
        }

        const address = localStorage.getItem('connectAddress')
        if (address) {
            data.address = address
            data.isConnect = true
            GameContract.loadContract().then(() => {
                loadInfo()
            })

        }
    }, [])
    return <Popup open={true} loading={loading} showBtn={false}>
        <h3 className=" text-2xl mb-4">Connect Wallet</h3>
        {
            loading ? <div className="flex items-center justify-center py-2">
                <img className="w-16 h-16" src="/images/ui/connect-loading.svg" alt="connect-loading" />
            </div> : <p className="flex items-center gap-2 text-center justify-center cursor-pointer py-2 hover:bg-[#7a542c]" onClick={connect}>
                <img src="/images/ui/metamask.svg" className="w-6 h-6" />
                <span className="text-white">MetaMask</span>
            </p>
        }
    </Popup>
}