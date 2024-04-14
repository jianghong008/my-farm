import { useContext, useEffect, useState } from "react"
import { Wallet } from "../utils/wallet"
import { UserContext } from "../data/user"
import { GameContract } from "../utils/game"
import { Popup } from "./common/Popup"
import { MessageBox } from "./common/MessageBox"
export function Connect() {
    const { data, setData } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const connect = async () => {
        if(loading){
            return
        }
        setLoading(true)
        const address = await Wallet.connectWallet().catch((error) => {
            setLoading(false)
            MessageBox.error(error)
        })
        if(!address){
            return
        }
        data.address = address
        data.isConnect = true
        localStorage.setItem('connectAddress', address)
        await GameContract.loadContract()
        let has = false
        try {
            await loadInfo()
            has = true
        } catch (error) {
            has = false
            console.error(error)
            console.log('user not exist')
        }
        if (has) {
            return
        }
        try {
            
            await GameContract.newUser()
            await loadInfo()
        } catch (error) {
            console.error(error)
            setLoading(false)
            MessageBox.error(error)
            disConnect()
        }
    }
    const loadInfo = async () => {
        setLoading(true)
        const info = await GameContract.getInfo()
        const consumes = await GameContract.getConsumes()
        data.consumes.cow = consumes[0]
        data.consumes.tree = consumes[1]
        setLoading(false)
        data.user = info
        setData({ ...data })
        console.log(info)
    }
    const disConnect = async () => {
        await Wallet.disconnectWallet()
        localStorage.removeItem('connectAddress')
        data.address = ''
        data.isConnect = false
        data.user.createTime = 0
        setData({ ...data })
    }

    const init = async () => {
        try {
            setLoading(true)
            await GameContract.loadContract()
            await loadInfo()
        } catch (error) {
            MessageBox.error(error)
            disConnect()
            setLoading(false)
        }
    }

    useEffect(() => {
        if (data.isConnect) {
            return
        }
        const address = localStorage.getItem('connectAddress')
        if (address) {
            data.address = address
            data.isConnect = true
            init()

        }
    }, [])
    return <Popup open={true} loading={loading} showBtn={false}>
        <h3 className=" text-xl mb-4">Connect Wallet</h3>
        {
            loading ? <div className="flex items-center justify-center py-2">
                <img className="w-16 h-16" src="/my-farm/images/ui/connect-loading.svg" alt="connect-loading" />
            </div> : <p className="flex items-center gap-2 text-center justify-center cursor-pointer py-2 hover:bg-[#7a542c]" onClick={connect}>
                <img src="/my-farm/images/ui/metamask.svg" className="w-6 h-6" />
                <span className="text-white">MetaMask</span>
            </p>
        }
    </Popup>
}