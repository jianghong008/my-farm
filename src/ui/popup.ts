
import { Dialog, RoundRectangle, Label } from "phaser3-rex-plugins/templates/ui/ui-components.js";
import { Theme } from "../data/theme";

export class Popup {
    public dialog?: Dialog
    public scene: Phaser.Scene
    constructor(scene: Phaser.Scene, title: string,showAction=true,customContent?: Phaser.GameObjects.GameObject) {
        this.scene = scene
        this.createDialog(scene, title,showAction,customContent)
    }
    show(): Promise<boolean> {
        return new Promise((resolve) => {
            if (!this.dialog) {
                resolve(false)
                return
            }
            const rect = this.dialog.popUp(700).getBounds()
            this.dialog.setPosition(this.scene.renderer.width / 2 - rect.width / 2, this.scene.renderer.height / 2 - rect.height / 2)
            this.dialog.on('button.click', (_a: Label, _: string, index: number) => {
                this.dialog?.hide()
                this.dialog?.destroy()
                if (index === 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }

            })
        })
    }
    open() {
        if (!this.dialog) {
            return
        }
        const rect = this.dialog.popUp(700).getBounds()
        this.dialog.setPosition(this.scene.renderer.width / 2 - rect.width / 2, this.scene.renderer.height / 2 - rect.height / 2)
    }
    close() {
        this.dialog?.destroy()
    }
    createDialog(scene: Phaser.Scene, title: string,showAction?: boolean, customContent?: Phaser.GameObjects.GameObject) {

        const bg = new RoundRectangle(scene, 0, 0, 100, 100, 6, Theme.Light.BackGround).setStrokeStyle(1, Theme.Light.Border)
        scene.add.existing(bg)
        const actions:Phaser.GameObjects.GameObject[] = []
        if(showAction){
            const btn1 = new Label(scene, {
                background: scene.add.existing(new RoundRectangle(scene, 0, 0, 100, 40, 10, Theme.Light.Button.Default)),
                text: scene.add.text(0, 0, 'No', {
                    fontSize: '16px',
                    color: '#4a331b'
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 5,
                    bottom: 5
                }
            })
            scene.add.existing(btn1)
            const btn2 = new Label(scene, {
                background: scene.add.existing(new RoundRectangle(scene, 0, 0, 100, 40, 10, Theme.Light.Button.Default)),
                text: scene.add.text(0, 0, 'Yes', {
                    fontSize: '16px',
                    color: '#4a331b'
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 5,
                    bottom: 5
                }
            })
            scene.add.existing(btn2)

            actions.push(btn1, btn2)
        }
        
        this.dialog = new Dialog(scene, {
            x: 0,
            y: 0,

            background: bg,
            content:customContent,
            title: new Label(scene, {
                background: new RoundRectangle(scene, 0, 0, 100, 40, 20, Theme.Light.Title),
                text: scene.add.text(0, 0, title, {
                    fontSize: '20px',
                    color: '#4a331b',
                    wordWrap: {
                        useAdvancedWrap: true,
                        width: 200
                    },

                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),

            actions,

            space: {
                title: 0,
                action: 5,

                left: 10,
                right: 10,
                top: 0,
                bottom: 10,
            },
        })
            .layout()
            .pushIntoBounds()

    }
}

