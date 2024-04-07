import { ReactNode } from "react"
import '../../assets/style/popup.css'
interface Props {
    open: boolean
    loading?: boolean
    showBtn?: boolean
    callback?: () => Promise<void>
    children: ReactNode
    close?: () => void
}
export function Popup(props: Props) {
    const { children } = props
    const callback = async () => {
        props.callback && props.callback()
    }
    const stopHandle = (e: any) => {
        e.stopPropagation()
    }
    const closePoup = () => {
        if (props.loading) {
            return
        }
        props.close && props.close()
    }
    return <div className=" bg-black/50 fixed left-0 top-0 w-full h-full flex items-center justify-center" style={{ display: props.open ? 'flex' : 'none' }} onClick={closePoup}>
        <div className="com-popup-border bg-[#b96f50] p-4 text-center select-none" onClick={stopHandle}>
            <div className="my-4">
                {children}
            </div>
            {
                props.showBtn && <div className="com-btn com-btn-border flex items-center justify-center gap-2 w-full py-2 bg-[#f3955a]" onClick={callback}>
                    {
                        props.loading && <img className="w-4 h-4" src="/images/ui/connect-loading.svg" alt="connect-loading" />
                    }
                    <span>Comfirm</span>
                </div>
            }
        </div>
    </div>
}