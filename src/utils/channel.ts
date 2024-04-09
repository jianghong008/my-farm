export enum ChannelMsgType {
    ShowToast,
    ClaimFertilizerPopup,
    CalimFruitsPopup,
}
export class Channel {
    private static _instance: Channel
    public static get Instance() {
        if (!Channel._instance) {
            Channel._instance = new Channel()
        }
        return Channel._instance
    }
    private listener = new Map<ChannelMsgType, Function[]>()
    public post(data: any, t: ChannelMsgType) {
        this.listener.get(t)?.forEach((fn) => { fn(data) })
    }

    public onMessage(t: ChannelMsgType, fn: Function) {
        if (!this.listener.has(t)) {
            this.listener.set(t, [fn])
        }else{
            const event = this.listener.get(t)
            const has = event?.findIndex((item) => { item == fn }) == -1
            console.log(has)
            if (has) {
                event?.push(fn)
            }
        } 
    }

    public clear() {
        this.listener.clear()
    }
}