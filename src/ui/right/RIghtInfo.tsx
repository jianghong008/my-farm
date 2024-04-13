import { useContext, } from "react"
import { UserContext } from "../../data/user"
import { Wallet } from "../../utils/wallet"
import { GameContract } from "../../utils/game"
import { CowPopup } from "./CowPopup"
import { TreePopup } from "./TreePopup"
import { MessageBox } from "../common/MessageBox"
import { Channel, ChannelMsgType } from "../../utils/channel"

export function RightInfo() {
    const { data, setData } = useContext(UserContext)

    const disConnect = async () => {
        await Wallet.disconnectWallet()
        localStorage.removeItem('connectAddress')
        data.address = ''
        data.isConnect = false
        data.user.createTime = 0
        setData({ ...data })
    }
    const loadInfo = async () => {
        try {
            const info = await GameContract.getInfo()
            data.user = info
            setData({ ...data })
        } catch (error) {
            MessageBox.error(error)
            disConnect()
        }
    }

    const getClaimed = () => {
        return Wallet.formatBigNumber(data.user.cow.cowClaim)
    }

    const getClaimedFruits = () => {
        return Wallet.formatBigNumber(data.user.tree.treeClaim)
    }

    const showManurePopup = () => {
        Channel.Instance.post(undefined, ChannelMsgType.ClaimManurePopup)
    }

    const showFruitsPopup = () => {
        Channel.Instance.post(undefined, ChannelMsgType.CalimFruitsPopup)
    }

    return <>
        <div className=" fixed right-0 top-0 flex flex-col items-end gap-2">
            <div title="disconnect" className=" bg-[#a77643] rounded-lg  px-2 py-1 mt-4 text-center select-none" onClick={disConnect}>
                <span>{Wallet.formatAddress(data.address)}</span>
            </div>
            <div title="manure" className=" bg-[#ce9354] rounded-lg border-2 border-[#6c4d2b] hover:border-[#ffd5a9]  px-2 py-1 mt-4 flex items-center gap-1 select-none" onClick={showManurePopup}>
                <img className="w-6 h-6" src="/images/ui/fertilizer.svg" alt="manure" />
                <span>{getClaimed()}</span>
            </div>
            <div title="fruits" className=" bg-[#ce9354] rounded-lg border-2 border-[#6c4d2b] hover:border-[#ffd5a9]  px-2 py-1 mt-4 flex items-center gap-1 select-none" onClick={showFruitsPopup}>
                <img className="w-6 h-6" src="/images/ui/fruits.svg" alt="fruits" />
                <span>{getClaimedFruits()}</span>
            </div>
        </div>
        <CowPopup loadInfo={loadInfo} />
        <TreePopup loadInfo={loadInfo} />
    </>
}