import {Scene} from 'phaser';

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  
  preload() {
    // Load any assets here from your assets directory
    this.load.image('cat-like', 'assets/cat-like-creature.png');

    // Sprites
    this.load.atlas('tabby', 'assets/sprites/tabby.png', 'assets/sprites/tabby.json');
    this.load.atlas('birb', 'assets/sprites/birb.png', 'assets/sprites/birb.json');

    this.load.image('parabg0', 'assets/maps/parabg0.png');
    this.load.image('parabg1', 'assets/maps/parabg1.png');
    this.load.image('sun', 'assets/maps/sun.png');
    this.load.image('tileset1', 'assets/maps/tileset1-ex.png');
    this.load.tilemapTiledJSON('map-level1', 'assets/maps/level1.json');

    // VFX
    this.load.image('cloud-puff', 'assets/particles/cloud-puff.png');
    this.load.image('shimmer', 'assets/particles/shimmer.png');

    // Music
    this.load.audio('hill-country', 'assets/music/orchestral1.mp3');
  }

  create() {
    // Tabby animations
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

    this.anims.create({
      key: 'tabby-atk1',
      frames: this.anims.generateFrameNames('tabby', {
        start: 0,
        end: 28,
        prefix: 'atk1-',
        suffix: '.png',
        zeroPad: 2
      }),
      frameRate: 60,
      repeat: 0
    });

    this.anims.create({
      key: 'tabby-atk2',
      frames: this.anims.generateFrameNames('tabby', {
        start: 29,
        end: 44,
        prefix: 'atk2-',
        suffix: '.png',
        zeroPad: 2
      }),
      frameRate: 60,
      repeat: 0
    });

    // Birb animations
    this.anims.create({
      key: 'birb-flap',
      frames: this.anims.generateFrameNames('birb', {
        start: 0,
        end: 59,
        prefix: 'flap-',
        suffix: '.png',
        zeroPad: 2
      }),
      frameRate: 60,
      repeat: -1
    });

    this.anims.create({
      key: 'birb-dive',
      frames: this.anims.generateFrameNames('birb', {
        start: 0,
        end: 39,
        prefix: 'dive-',
        suffix: '.png',
        zeroPad: 2
      }),
      frameRate: 60,
      repeat: -1
    });

    this.anims.create({
      key: 'birb-knockback',
      frames: this.anims.generateFrameNames('birb', {
        start: 0,
        end: 19,
        prefix: 'knockback-',
        suffix: '.png',
        zeroPad: 2
      }),
      frameRate: 60,
      repeat: -1
    });

    this.anims.create({
      key: 'birb-ko',
      frames: this.anims.generateFrameNames('birb', {
        start: 0,
        end: 39,
        prefix: 'ko-',
        suffix: '.png',
        zeroPad: 2
      }),
      frameRate: 60,
      repeat: -1
    });

    this.scene.start('scene-game');
  }
}

export default BootScene;