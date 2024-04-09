import { Channel, ChannelMsgType } from "../utils/channel";

export class CowObject extends Phaser.GameObjects.Sprite{
    private action='left'
    private timer:any;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'cow');
        this.scene.add.existing(this);
        this.createAnimation();
        this.setAction('idl');
        this.timer = setInterval(this.randomAction.bind(this), 3000)
        this.setInteractive({ cursor: 'pointer',inputEnabled: true }).on('pointerdown',this.pointerdown.bind(this))
    }
    pointerdown(e:Phaser.Input.Pointer) {
        Channel.Instance.post(e, ChannelMsgType.ClaimFertilizerPopup)
    }
    createAnimation() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('cow', { start: 0, end: 4 }),
            frameRate: 10,
            duration:1500,
            repeat: -1
        });
        this.anims.create({
            key: 'idl',
            frames: this.anims.generateFrameNumbers('cow', { start: 0, end: 2 }),
            frameRate: 3,
            duration:3000,
            repeat: -1
        });
    }
    randomAction(){
        const dt = Math.random()
        if(dt>0.3){
            this.setAction('idl')
        }else if(dt>0.15){
            this.setAction('right')
        }else{
            this.setAction('left')
        }
        
    }
    setAction(ac:string){
        if(this.action==ac){
            return
        }
        this.action=ac
        if(this.action=='left'){
            this.flipX=true
        }else{
            this.flipX=false
        }
        if(this.action=='idl'){
            this.play('idl')
        }else{
            this.play('walk')
        }
    }
    update(): void {
        if(this.action=='left'&&this.x>16*9){
            this.x-=0.2
        }else if(this.action=='left'){
            this.setAction('right')
        }
        if(this.action=='right'&&this.x<16*13){
            this.x+=0.2
        }else if(this.action=='right'){
            this.setAction('left')
        }
    }
    destroy(fromScene?: boolean | undefined): void {
        clearInterval(this.timer)
        super.destroy(fromScene);
    }
}