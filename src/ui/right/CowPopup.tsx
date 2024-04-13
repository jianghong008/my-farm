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
    const [manure, setmanure] = useState(0)
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
            await claimmanure()
        } else {
            await feedCow()
        }
    }

    const getClaimedFruits = () => {
        return Wallet.formatBigNumber(data.user.tree.treeClaim)
    }

    const getConsumes = () => {
        return Wallet.formatBigNumber(data.consumes.cow)
    }

    const claimmanure = async () => {
        if (manure <= 1) {
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
            MessageBox.error(error)
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
            MessageBox.error(error)
        }
    }

    const showManurePopup = async () => {
        cowPopup.open = true
        setCowPopup({ ...cowPopup })
        getmanure()
    }

    const getmanure = async () => {
        const nowTime = Math.floor(Date.now() / 1000)
        const info = data.user
        const workTime = (
            (info.cow.cowFeedingTime * 1 + GameContract.cowFeeding) > nowTime
                ? (nowTime - info.cow.cowFeedingTime * 1)
                : GameContract.cowFeeding
        );
        const total = Wallet.formatNumber(workTime *
            Wallet.formatBigNumber(info.cow.cow, 4), 4) +
            Wallet.formatBigNumber(info.cow.cowStore, 4) - Wallet.formatBigNumber(info.cow.cowClaimLatest, 4)
        setmanure(Wallet.formatNumber(total))
    }

    useEffect(() => {
        if (!data.user.cow) {
            return
        }
        Channel.Instance.onMessage(ChannelMsgType.ClaimManurePopup, showManurePopup)
    }, [])

    return <Popup open={cowPopup.open} loading={loading} showBtn={true} close={() => { setCowPopup({ ...cowPopup, open: false }); }} callback={cowCallback}>
        <h2 className=" text-2xl font-bold">Cow</h2>
        <h3 className=" mb-4 flex gap-2">
            <span
                onClick={() => { setCowPopup({ ...cowPopup, type: 'CLAIM' }) }} className={`com-btn ${cowPopup.type === 'CLAIM' ? 'border-b-2' : ''}`}>Claim</span>
            <span
                onClick={() => { setCowPopup({ ...cowPopup, type: 'FEED' }) }} className={`com-btn ${cowPopup.type === 'FEED' ? 'border-b-2' : ''}`}>Feed</span>
        </h3>
        {
            cowPopup.type === 'CLAIM' ? <p className=" text-sm flex items-center gap-1 justify-center">
                <img className="w-6 h-6" src="/images/ui/fertilizer.svg" alt="manure" />
                <span>{manure}</span>
            </p> : <p className=" text-sm flex items-center gap-1 justify-center">
                <span>fee:</span>
                <span>{getConsumes()}</span>
                <img className="w-4 h-4" src="/images/ui/fruits.svg" alt="fruits" />
            </p>
        }
    </Popup>
}