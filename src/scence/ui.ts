import { Theme } from "../data/theme";
import { UserData } from "../data/user";
import { Popup } from "../ui/popup";
import { Sizer, RoundRectangle, Toast, Label } from "phaser3-rex-plugins/templates/ui/ui-components.js";
export class UiScene extends Phaser.Scene {
    public depositPopup?: Popup
    private mainUI?: Phaser.GameObjects.Layer
    private toast?: Toast
    private connectPopup?: Popup
    constructor() {
        super({ key: 'ui-scence', active: true });
    }
    preload() {
        this.load.image('fertilizer', '/images/ui/fertilizer.svg')
        this.load.image('metamask', '/images/ui/metamask.svg')
    }
    create() {
        const rootScence = this.scene.get('root-scence')
        rootScence.events.on('showDynamicToast', this.showDynamicToast.bind(this))
        
        if(UserData.Instance.info.createTime == 0){
            this.connectWallet()
        }else{
            this.renderMainUI()
        }
        
    }
    renderMainUI() {
        if (!this.mainUI) {
            this.mainUI = this.add.layer()
        } else {
            this.mainUI.destroy()
            this.mainUI = this.add.layer()
        }

        // top
        const top = new Sizer(this, {
            orientation: 'y',
            space: {
                item: 6,
                right: 8,
            },

        })
        // fertilizer
        const fertilizer = this.createIconBtn('2305', 'fertilizer', this.claimFertilizer.bind(this))
        const mfc = this.createIconBtn('24', 'fertilizer', this.deposit.bind(this))
        top.add(fertilizer, { align: 'right' }).add(mfc, { align: 'right' })

        this.mainUI?.add(top.layout())
        const rect = top.getBounds();
        top.setPosition(this.renderer.width - rect.width / 2, rect.height);
        // top.drawBounds(this.add.graphics(),0xff0000)
    }
    showDynamicToast(e:Phaser.Input.Pointer){
        this.showToast('hi',e.x, e.y-20)
    }
    showToast(title: string, x?: number, y?: number) {
        const bg = new RoundRectangle(this, 0, 0, 0, 0, 6, 0xfebf7b).setStrokeStyle(1, 0x81592f)
        this.toast = new Toast(this, {
            background: bg,
            text: this.add.text(0, 0, title,{fontSize:24}),
            space:{
                top:4,
                left:6,
                right:6,
                bottom:4
            }
        })
        if (x != undefined && y != undefined) {
            this.toast.setPosition(x, y)
        } else {
            const rect = this.toast.layout().getBounds()
            this.toast.setPosition(this.renderer.width / 2 - rect.width / 2, rect.height)
        }
        this.toast.showMessage(title)
    }
    createIconBtn(title: string, texture: string, func: Function) {
        const bg = new RoundRectangle(this, 0, 0, 0, 0, 6, Theme.Light.Button.Default).setStrokeStyle(1, Theme.Light.Border)
        const ico = this.add.image(0, 0, texture)
        const text = this.add.text(0, 0, title)
        const btn = new Sizer(this, {
            orientation: 'x',
            space: {
                left: 6,
                right: 6
            }
        })
        bg.setDepth(-1)
        btn.addBackground(this.add.existing(bg))
        btn.add(ico, 1).add(text, 1).layout().setChildrenInteractive({})
        btn.on('child.over', () => {
            bg.setStrokeStyle(1, Theme.Light.Button.Hover)
        })
        btn.on('child.out', () => {
            bg.setStrokeStyle(1, Theme.Light.Button.Default)
        })
        btn.on('child.click', () => {
            func()
        })

        return btn
    }
    async claimFertilizer() {
        if (this.depositPopup?.dialog?.active) {
            this.depositPopup.close();
            this.depositPopup = undefined
        } else {
            this.depositPopup = new Popup(this, 'claim fertilizer,current number:8989')
            const ok = await this.depositPopup.show()
            console.log(ok)
            this.showToast('hi')
        }
    }
    async connectWallet() {
        if (this.connectPopup?.dialog?.active) {
            this.connectPopup.close();
            this.depositPopup = undefined
        } else {
            const btn = new Label(this,{
                text:this.add.text(0,0,'connect',{
                    color:'0xfff'
                })
            })
            this.add.existing(btn)
            this.connectPopup = new Popup(this, 'connect wallet',false,btn)
            this.connectPopup.open()
            this.showToast('hi')
        }
    }
    async connect(){
        console.log('connect')
    }
    deposit() {

    }
}