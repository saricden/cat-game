import {Scene} from 'phaser';

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  
  preload() {
    // Load any assets here from your assets directory
    this.load.image('cat-like', 'assets/cat-like-creature.png');

    this.load.atlas('tabby', 'assets/sprites/tabby.png', 'assets/sprites/tabby.json');

    this.load.image('parabg0', 'assets/maps/parabg0.png');
    this.load.image('parabg1', 'assets/maps/parabg1.png');
    this.load.image('sun', 'assets/maps/sun.png');
    this.load.image('tileset1', 'assets/maps/tileset1-ex.png');
    this.load.tilemapTiledJSON('map-level1', 'assets/maps/level1.json');

    // VFX
    this.load.image('cloud-puff', 'assets/particles/cloud-puff.png');
  }

  create() {
    // Create animations
    this.anims.create({
      key: 'tabby-idle',
      frames: this.anims.generateFrameNames('tabby', {
        start: 0,
        end: 59,
        prefix: 'idle-',
        suffix: '.png',
        zeroPad: 2
      }),
      frameRate: 80,
      repeat: -1
    });

    this.anims.create({
      key: 'tabby-run',
      frames: this.anims.generateFrameNames('tabby', {
        start: 0,
        end: 59,
        prefix: 'run-',
        suffix: '.png',
        zeroPad: 2
      }),
      frameRate: 80,
      repeat: -1
    });

    this.anims.create({
      key: 'tabby-flip',
      frames: this.anims.generateFrameNames('tabby', {
        start: 0,
        end: 9,
        prefix: 'flip-',
        suffix: '.png',
        zeroPad: 0
      }),
      frameRate: 60,
      repeat: -1
    });

    this.anims.create({
      key: 'tabby-fall',
      frames: this.anims.generateFrameNames('tabby', {
        start: 0,
        end: 9,
        prefix: 'fall-',
        suffix: '.png',
        zeroPad: 0
      }),
      frameRate: 60,
      repeat: -1
    });

    this.scene.start('scene-game');
  }
}

export default BootScene;