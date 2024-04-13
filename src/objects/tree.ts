import { Channel, ChannelMsgType } from "../utils/channel";

export class TreeObject extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y,'objs', 0);
        this.scene.add.existing(this);
        this.setInteractive({
            cursor: 'pointer',
            inputEnabled: true,
            hitArea: new Phaser.Geom.Rectangle(48, 0, 32, 32),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains
        }).on('pointerdown',this.pointerdown.bind(this))

        this.setCrop(48, 0, 32, 32)
    }
    pointerdown(e:Phaser.Input.Pointer) {
        Channel.Instance.post(e, ChannelMsgType.CalimFruitsPopup)
    }
}