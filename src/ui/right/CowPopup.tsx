import { useContext, useEffect, useState } from "react";
import { Popup } from "../common/Popup"
import { UserContext } from "../../data/user";
import { MessageBox } from "../common/MessageBox"
import { Channel, ChannelMsgType } from "../../utils/channel"
import { GameContract } from "../../utils/game";
import { Wallet } from "../../utils/wallet";
type CowPopupType = 'CLAIM' | 'FEED'
interface CowProps {
    loadInfo: () => Promise<void>
}
export function CowPopup(props: CowProps) {
    const { data } = useContext(UserContext)
    const [fertilizer, setFertilizer] = useState(0)
    const [cowPopup, setCowPopup] = useState({
        open: false,
        type: 'CLAIM' as CowPopupType
    })
    const [loading, setLoading] = useState(false)

    const cowCallback = async () => {
        if (loading) {
            return
        }
        if (cowPopup.type === 'CLAIM') {
            await claimFertilizer()
        } else {
            await feedCow()
        }
    }

    const getClaimedFruits = () => {
        return Wallet.formatBigNumber(data.user.tree.treeClaim)
    }

    const claimFertilizer = async () => {
        if (fertilizer <= 1) {
            MessageBox.error('no need claim')
            return
        }
        setLoading(true)
        try {
            await GameContract.claimManure()
            await props.loadInfo()
            setLoading(false)
            cowPopup.open = false
            setCowPopup(cowPopup)
            MessageBox.success('claim success')
        } catch (error) {
            setLoading(false)
            MessageBox.error('claim failed')
        }
    }

    const feedCow = async () => {
        if (getClaimedFruits() <= 1) {
            MessageBox.error('no need feed')
            return
        }
        setLoading(true)
        try {
            await GameContract.feedCow()
            await props.loadInfo()
            setLoading(false)
            cowPopup.open = false
            setCowPopup(cowPopup)
            MessageBox.success('feed success')
        } catch (error) {
            setLoading(false)
            MessageBox.error('feed failed')
        }
    }

    const showFertilizerPopup = async () => {
        cowPopup.open = true
        setCowPopup({...cowPopup})
        getFertilizer()
    }

    const getFertilizer = async () => {
        const nowTime = Math.floor(Date.now() / 1000)
        const info = data.user
        const workTime = (
            (info.cow.cowFeedingTime * 1 + GameContract.cowFeeding) > nowTime
                ? (nowTime - info.cow.cowFeedingTime * 1)
                : GameContract.cowFeeding
        );
        const total = Wallet.formatNumber(workTime *
            Wallet.formatBigNumber(info.cow.cow, 4),4) +
            Wallet.formatBigNumber(info.cow.cowStore, 4) - Wallet.formatBigNumber(info.cow.cowClaimLatest, 4)
        setFertilizer(Wallet.formatNumber(total))
    }

    useEffect(() => {
        if (!data.user.cow) {
            return
        }
        Channel.Instance.onMessage(ChannelMsgType.ClaimFertilizerPopup, showFertilizerPopup)
    }, [])

    return <Popup open={cowPopup.open} loading={loading} showBtn={true} close={() => { setCowPopup({ ...cowPopup, open: false }); }} callback={cowCallback}>
        <h3 className=" text-2xl mb-4 font-bold flex gap-2">
            <span
                onClick={() => { setCowPopup({ ...cowPopup, type: 'CLAIM' }) }} className={`com-btn ${cowPopup.type === 'CLAIM' ? 'border-b-2' : ''}`}>Claim</span>
            <span
                onClick={() => { setCowPopup({ ...cowPopup, type: 'FEED' }) }} className={`com-btn ${cowPopup.type === 'FEED' ? 'border-b-2' : ''}`}>Feed</span>
        </h3>
        {
            cowPopup.type === 'CLAIM' ? <p className=" text-sm">
                <span>fers: </span>
                <span>{fertilizer}</span>
            </p> : <p className=" text-sm">
                <span>fruits: </span>
                <span>{getClaimedFruits()}</span>
            </p>
        }
    </Popup>
}