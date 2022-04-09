import {Scene, Math as pMath} from 'phaser';

class GameScene extends Scene {
  constructor() {
    super("scene-game");
  }

  create() {
    this.cat = this.physics.add.sprite(0, 0, 'tabby');
    this.cat.body.setSize(40, 65);
    this.cat.body.setOffset(5, 0);
    this.maxSpeed = 275;
    this.jumpHeight = 450;
    this.cat.body.setMaxVelocityY(450);
    this.cat.body.checkCollision.up = false;

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

    this.physics.add.collider(this.cat, this.ground);

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

        this.cat.setVelocityX(vx);
        this.cameras.main.setFollowOffset(-vx / 2, 0);

        if (dx < 0) {
          this.cat.setFlipX(true);
        }
        else {
          this.cat.setFlipX(false);
        }

        if (dy > this.jumpThreshold && this.cat.body.blocked.down) {
          this.cat.setVelocityY(-this.jumpHeight);
          this.catContrail.explode(50);
        }

        this.sy = y;
      }
    });

    this.input.on('pointerup', () => {
      this.sx = null;
      this.sy = null;
      this.cat.setVelocityX(0);
      this.time.addEvent({
        delay: 10,
        repeat: 12,
        callback: () => {
          this.cameras.main.setFollowOffset(this.cameras.main.followOffset.x * 0.75, 0);
        }
      });
    });

    this.catContrail.stop();

    this.cameras.main.startFollow(this.cat);
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

    if (left.isDown) {
      this.cat.setVelocityX(-this.maxSpeed);
      this.cat.setFlipX(true);
      this.isTouchControlled = false;
    }
    else if (right.isDown) {
      this.cat.setVelocityX(this.maxSpeed);
      this.cat.setFlipX(false);
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

}
export default GameScene;