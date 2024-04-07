import { Channel, ChannelMsgType } from "../utils/channel";

export class TreeObject extends Phaser.GameObjects.Container {
    private tree: Phaser.GameObjects.Image
    private fruits: Phaser.GameObjects.Container
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.tree = scene.add.image(-36, 0, 'tree');
        this.add(this.tree);
        this.tree.setCrop(36, 0, 50, 50);
        this.fruits = new Phaser.GameObjects.Container(scene, 0, 0);
        this.scene.add.existing(this);
        this.createFruits();
        this.tree.setInteractive({
            cursor: 'pointer',
            hitArea: new Phaser.Geom.Rectangle(36, 0, 50, 50)
        }).on('pointerdown',this.pointerdown.bind(this))
    }
    pointerdown(e:Phaser.Input.Pointer) {
        Channel.Instance.post(e, ChannelMsgType.CalimFruitsPopup)
    }
    createFruits() {
        for (let i = 0; i < 3; i++) {
            const x = Math.random()*25+5
            const y = Math.random()*15+10
            const fruit = this.scene.add.image(-34 + x, -52 + y, 'tree');
            fruit.setCrop(34, 52, 10, 10);
            this.fruits.add(fruit);
        }
        this.add(this.fruits);
    }
}