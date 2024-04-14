import { Scene } from 'phaser'
import { TreeObject } from '../objects/tree';
import { CowObject } from '../objects/cow';
export default class RootScene extends Scene {
    public layer?: Phaser.Tilemaps.TilemapLayer
    public map?: Phaser.Tilemaps.Tilemap
    public tree?: TreeObject
    public cow?: CowObject
    public gameLayer?: Phaser.GameObjects.Layer
    rexUI: any;
    constructor() {
        super({ key: 'root-scence'});
    }
    async preload() {
        this.load.tilemapTiledJSON('bg-farm', '/images/bg-farm.tmj')
        this.load.image('ground', '/images/Hills.png')
        this.load.image('objs', '/images/objs.png')
        this.load.image('tree', '/images/tree.png')
        this.load.image('fences', '/images/fences.png')
        this.load.spritesheet('cow', '/images/cow.png', {
            frameWidth: 32,
            frameHeight: 32
        })

    }
    create() {
        this.gameLayer = this.add.layer()
        this.createObjects()
        this.createUI()
    }
    
    createObjects() {
        if (!this.gameLayer) {
            return
        }
        this.map = this.make.tilemap({ key: 'bg-farm' });
        const ground = this.map.addTilesetImage('ground');
        const objs = this.map.addTilesetImage('objs');
        const fences = this.map.addTilesetImage('fences');
        if (!ground || !fences || !objs) {
            console.warn('no ground')
            return
        }
        const groundLayer = this.map.createLayer(0, [ground], 0, 0);
        const fencesLayer = this.map.createLayer(2, [fences], 0, 0);
        const objsLayer = this.map.createLayer(1, [objs], 0, 0);
        groundLayer && this.gameLayer.add(groundLayer);
        fencesLayer && this.gameLayer.add(fencesLayer);
        objsLayer && this.gameLayer.add(objsLayer);
        
        
        if (this.layer) {
            this.cameras.main.setBounds(0, 0, this.layer.width, this.layer.height);
        }
        this.cameras.main.zoom = 1.5;
        const centerX = this.renderer.width / 2 - this.map.widthInPixels / 2;
        const centerY = this.renderer.height / 2 - this.map.heightInPixels / 2;

        this.cameras.main.scrollX = -centerX;
        this.cameras.main.scrollY = -centerY;

        this.tree = new TreeObject(this, this.map.widthInPixels / 2 + 50, this.map.heightInPixels / 2 + 50);
        this.gameLayer.add(this.tree);
        this.cow = new CowObject(this, this.map.tileWidth * 9, this.map.tileHeight * 13);
        this.gameLayer.add(this.cow);

        this.initMoveMap()
    }
    initMoveMap(){
        const pointerData = {
            isDragging :false,
            x:0,
            y:0
        }
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            pointerData.isDragging = true;
            pointerData.x = pointer.x;
            pointerData.y = pointer.y;
            pointer
        })
        this.input.on('pointerup', () => {
            pointerData.isDragging = false;
            this.game.canvas.style.cursor = 'default'
        })
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if(pointer.isDown){
                this.game.canvas.style.cursor = 'grabbing'
                this.cameras.main.scrollX -= (pointer.x - pointerData.x)/50;
                this.cameras.main.scrollY -= (pointer.y - pointerData.y)/50;
            }
        })
    }

    createUI() {
        
    }
    update(_time: number, _: number): void {
        if (this.tree) this.tree.update();
        if (this.cow) this.cow.update();
    }
}