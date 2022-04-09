import {Scene, Math as pMath} from 'phaser';

class GameScene extends Scene {
  constructor() {
    super("scene-game");
  }

  create() {
    this.cat = this.physics.add.sprite(0, 0, 'tabby');
    this.cat.body.setSize(18, 50);
    this.cat.body.setOffset(15, 10);
    this.maxSpeed = 275;
    this.jumpHeight = 450;
    this.cat.body.setMaxVelocityY(450);

    this.cloudPuff = this.add.particles('cloud-puff');
    this.catContrail = this.cloudPuff.createEmitter({
      radial: true,
      x: 0,
      y: 0,
      follow: this.cat,
      followOffset: {
        x: 0,
        y: 25
      },
      quantity: 2,
      angle: {
        min: 0,
        max: 360
      },
      scale: {
        start: 0.65,
        end: 0
      },
      alpha: {
        min: 0.01,
        max: 0.1
      },
      speedX: {
        min: 25,
        max: 65
      },
      speedY: {
        min: -25,
        max: -115
      }
    });

    this.shimmer = this.add.particles('shimmer');
    this.shimmerFX = this.shimmer.createEmitter({
      quantity: 2,
      lifespan: 1500,
      x: {
        min: -window.innerWidth,
        max: window.innerWidth * 2
      },
      y: {
        min: -window.innerHeight,
        max: window.innerHeight * 2
      },
      alpha: (particle, key, t) => {
        return (1 - t);
      },
      // radial: true,
      // angle: {
      //   min: 0,
      //   max: 360
      // },
      scale: {
        min: 0.1,
        max: 0.35
      },
      speedX: {
        min: 0,
        max: 25
      },
      speedY: 0
    });

    this.tilemap = this.add.tilemap('map-level1');
    const tiles = this.tilemap.addTilesetImage('tileset1', 'tileset1', 32, 32, 1, 2);

    this.ground = this.tilemap.createLayer('ground', tiles);
    this.fg = this.tilemap.createLayer('fg', tiles);
    this.bg = this.tilemap.createLayer('bg', tiles);

    this.parabg0 = this.add.tileSprite(0, this.tilemap.heightInPixels / 3, window.innerWidth, 2000, 'parabg0');
    this.parabg0.setOrigin(0, 0.5);
    this.parabg0.setScrollFactor(0, 0.4);

    this.parabg1 = this.add.tileSprite(0, this.tilemap.heightInPixels / 2, window.innerWidth, 1158, 'parabg1');
    this.parabg1.setOrigin(0, 0.5);
    this.parabg1.setScrollFactor(0, 0.65);

    this.sun = this.add.image(window.innerWidth, 0, 'sun');
    this.sun.setScrollFactor(0);

    this.ground.setCollisionByProperty({ collides: true });

    const spawnPoints = this.tilemap.getObjectLayer('spawn').objects;

    spawnPoints.forEach(({x, y, name}) => {
      if (name === 'tabby') {
        this.cat.setPosition(x, y);
      }
    });

    this.physics.add.collider(this.cat, this.ground, null, (cat, tile) => {
      if (tile.index === 4) { // 4 = platform tile
        return (cat.y <= tile.pixelY);
      }
      else {
        return true;
      }
    });

    this.parabg0.setDepth(-3);
    this.sun.setDepth(-2);
    this.parabg1.setDepth(-1);
    this.bg.setDepth(0);
    this.ground.setDepth(1);
    this.cloudPuff.setDepth(2);
    this.cat.setDepth(3);
    this.fg.setDepth(4);
    this.shimmer.setDepth(5);
    
    // Create a helper object for our arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // Attack / combo logic
    this.attackLock = false;
    this.comboStage = 0;

    let attack = () => {
      if (!this.attackLock || this.comboStage === 2) {
        this.cat.play('tabby-atk1');
        this.attackLock = true;
      }
      else if (this.comboStage === 1) {
        this.cat.play('tabby-atk2');
        this.comboStage = 0;
        this.cameras.main.shake(100, 0.005);
      }
    };
    attack = attack.bind(this);

    this.input.keyboard.on('keydown-SPACE', attack);

    this.cat.on('animationcomplete-tabby-atk1', () => {
      this.attackLock = false;
      this.comboStage = 0;
    });

    this.cat.on('animationcomplete-tabby-atk2', () => {
      this.attackLock = false;
      this.comboStage = 0;
    });

    this.cat.on('animationupdate', ({key}, {index}) => {
      if (key === 'tabby-atk1' && index > 11) {
        this.comboStage = 1;
      }
      else if (key === 'tabby-atk2' && index > 7) {
        this.comboStage = 2;
      }
    });

    // Touch controls
    this.isTouchControlled = false;
    this.jumpThreshold = 10;
    this.sx = null;
    this.sy = null;

    this.input.on('pointerdown', ({x, y}) => {
      this.sx = x;
      this.sy = y;
      this.isTouchControlled = true;
    });

    this.input.on('pointermove', ({x, y}) => {
      if (this.sx !== null && this.sy !== null) {
        const dx = -(this.sx - x);
        const dy = (this.sy - y);

        const vx = Math.max(Math.min(dx * 2, this.maxSpeed), -this.maxSpeed);

        if (!this.attackLock) {
          this.cat.setVelocityX(vx);
          this.cameras.main.setFollowOffset(-vx / 2, -150);
        }

        if (dx < 0) {
          this.cat.setFlipX(true);
          this.cat.body.setOffset(29, 10);
        }
        else if (dx > 0) {
          this.cat.setFlipX(false);
          this.cat.body.setOffset(15, 10);
        }

        if (dy > this.jumpThreshold && this.cat.body.blocked.down && !this.attackLock) {
          this.cat.setVelocityY(-this.jumpHeight);
          this.catContrail.explode(50);
        }

        this.sy = y;
      }
    });

    this.input.on('pointerup', ({x, y}) => {
      // Tap
      if (this.sx === x && this.sy === y) {
        attack();
      }

      this.sx = null;
      this.sy = null;
      this.cat.setVelocityX(0);
      this.time.addEvent({
        delay: 10,
        repeat: 12,
        callback: () => {
          this.cameras.main.setFollowOffset(this.cameras.main.followOffset.x * 0.75, -150);
        }
      });
    });

    this.catContrail.stop();

    this.cameras.main.startFollow(this.cat);
    this.cameras.main.setFollowOffset(0, -150);
    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    this.cameras.main.setBackgroundColor(0x4AB7CF);
  }

  update(time, delta) {
    const {left, right, up, down} = this.cursors;
    const isGrounded = this.cat.body.blocked.down;

    // Parallax effects
    this.parabg0.tilePositionX = this.cameras.main.scrollX * 0.5;
    this.parabg1.tilePositionX = this.cameras.main.scrollX * 0.75;

    // Shimmer effect
    this.shimmerFX.setPosition(this.cameras.main.scrollX + pMath.Between(-window.innerWidth, window.innerWidth * 2), this.cameras.main.scrollY + pMath.Between(-window.innerHeight, window.innerHeight * 2));

    if (!this.attackLock) {
      if (left.isDown) {
        this.cat.setVelocityX(-this.maxSpeed);
        this.cat.setFlipX(true);
        this.cat.body.setOffset(29, 10);
        this.isTouchControlled = false;
      }
      else if (right.isDown) {
        this.cat.setVelocityX(this.maxSpeed);
        this.cat.setFlipX(false);
        this.cat.body.setOffset(15, 10);
        this.isTouchControlled = false;
      }
      else if (!this.isTouchControlled) {
        this.cat.setVelocityX(0);
      }
      
      if (up.isDown && isGrounded) {
        this.cat.setVelocityY(-this.jumpHeight);
        this.isTouchControlled = false;
        this.catContrail.explode(50);
      }

      const {x: vx, y: vy} = this.cat.body.velocity;

      if (isGrounded) {
        this.cat.rotation = 0;
  
        if (vx === 0) {
          this.cat.play('tabby-idle', true);
          this.catContrail.stop();
        }
        else {
          this.cat.play('tabby-run', true);
          this.catContrail.emitParticle(2);
        }
      }
      else {
        if (vy <= 0) {
          this.cat.play('tabby-flip', true);
          
          const flipRot = 5 * Math.PI * (delta / 1000);
  
          if (this.cat.flipX) {
            this.cat.rotation -= flipRot;
          }
          else {
            this.cat.rotation += flipRot;
          }
        }
        else {
          this.cat.play('tabby-fall', true);
          this.cat.rotation = 0;
        }
      }
    }
    else {
      this.cat.body.setVelocityX(0);
    }
  }

}
export default GameScene;