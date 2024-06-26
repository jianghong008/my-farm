import { useContext, useEffect, useState } from "react";
import { Popup } from "../common/Popup"
import { UserContext } from "../../data/user";
import { MessageBox } from "../common/MessageBox"
import { Channel, ChannelMsgType } from "../../utils/channel"
import { GameContract } from "../../utils/game";
import { Wallet } from "../../utils/wallet";
type TreePopupType = 'CLAIM' | 'FEED'
interface CowProps {
    loadInfo: () => Promise<void>
}
export function TreePopup(props: CowProps) {
    const { data } = useContext(UserContext)
    const [fruits, setFruits] = useState(0)
    const [treePopup, setTreePopup] = useState({
        open: false,
        type: 'CLAIM' as TreePopupType
    })
    const [loading, setLoading] = useState(false)

    const cowCallback = async () => {
        if (loading) {
            return
        }
        if (treePopup.type === 'CLAIM') {
            await claimFruits()
        } else {
            await feedTree()
        }
    }

    const getClaimedFertilizer = () => {
        return Wallet.formatBigNumber(data.user.cow.cowClaim)
    }

    const claimFruits = async () => {
        if (fruits <= 1) {
            MessageBox.error('no need claim')
            return
        }
        setLoading(true)
        try {
            await GameContract.claimFruits()
            await props.loadInfo()
            setLoading(false)
            treePopup.open = false
            setTreePopup(treePopup)
            MessageBox.success('claim success')
        } catch (error) {
            setLoading(false)
            MessageBox.error(error)
        }
    }

    const feedTree = async () => {
        if (getClaimedFertilizer() <= 1) {
            MessageBox.error('no need feed')
            return
        }
        setLoading(true)
        try {
            await GameContract.manureTree()
            await props.loadInfo()
            setLoading(false)
            treePopup.open = false
            setTreePopup(treePopup)
            MessageBox.success('feed success')
        } catch (error) {
            setLoading(false)
            MessageBox.error(error)
        }
    }

    const showFruitsPopup = async () => {
        treePopup.open = true
        setTreePopup({...treePopup})
        getFruits()
        
    }

    const getConsumes = () => {
        return Wallet.formatBigNumber(data.consumes.tree)
    }

    const getFruits = async () => {
        const nowTime = Math.floor(Date.now() / 1000)
        const info = data.user
        const workTime = (
            (info.tree.treeFeedingTime * 1 + GameContract.treeFeeding) > nowTime
                ? (nowTime - info.tree.treeFeedingTime * 1)
                : GameContract.treeFeeding
        );
        const total = (workTime *
            Wallet.formatBigNumber(info.tree.tree) +
            Wallet.formatBigNumber(info.tree.treeStore)) - Wallet.formatBigNumber(info.tree.treeClaimLatest)
        setFruits(Wallet.formatNumber(total))
    }

    useEffect(() => {
        if (!data.user.cow) {
            return
        }
        Channel.Instance.onMessage(ChannelMsgType.CalimFruitsPopup, showFruitsPopup)
    }, [])

    return <Popup open={treePopup.open} loading={loading} showBtn={true} close={() => { setTreePopup({ ...treePopup, open: false }); }} callback={cowCallback}>
        <h2 className=" text-2xl font-bold">Tree</h2>
        <h3 className=" mb-4 flex gap-2">
            <span
                onClick={() => { setTreePopup({ ...treePopup, type: 'CLAIM' }) }} className={`com-btn ${treePopup.type === 'CLAIM' ? 'border-b-2' : ''}`}>Claim</span>
            <span
                onClick={() => { setTreePopup({ ...treePopup, type: 'FEED' }) }} className={`com-btn ${treePopup.type === 'FEED' ? 'border-b-2' : ''}`}>Manure</span>
        </h3>
        {
            treePopup.type === 'CLAIM' ? <p className=" text-sm flex items-center gap-1 justify-center">
                <img className="w-4 h-4" src="/my-farm/images/ui/fruits.svg" alt="fertilizer" />
                <span>{fruits}</span>
            </p> : <p className=" text-sm flex items-center gap-1 justify-center">
                <span>fee:</span>
                <span>{getConsumes()}</span>
                <img className="w-6 h-6" src="/my-farm/images/ui/fertilizer.svg" alt="fertilizer" />
            </p>
        }
    </Popup>
}