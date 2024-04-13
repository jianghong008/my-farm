export enum ChannelMsgType {
    ShowToast,
    ClaimManurePopup,
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
    private listener = new Map<ChannelMsgType, Map<string, Function>>()
    public post(data: any, t: ChannelMsgType) {
        this.listener.get(t)?.forEach((fn) => { fn(data) })
    }

    public onMessage(t: ChannelMsgType, fn: Function) {
        const event = this.listener.get(t)
        if (!event) {
            this.listener.set(t, new Map<string, Function>().set(fn.name, fn))
        }else{
            event.set(fn.name, fn)
        }
    }

    public clear() {
        this.listener.clear()
    }
}