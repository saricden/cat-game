import {Scene} from 'phaser';

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

    this.tilemap = this.add.tilemap('map-level1');
    const tiles = this.tilemap.addTilesetImage('tileset1', 'tileset1', 32, 32, 1, 2);

    this.ground = this.tilemap.createLayer('ground', tiles);

    this.ground.setCollisionByProperty({ collides: true });

    const spawnPoints = this.tilemap.getObjectLayer('spawn').objects;

    spawnPoints.forEach(({x, y, name}) => {
      if (name === 'tabby') {
        this.cat.setPosition(x, y);
      }
    });

    this.physics.add.collider(this.cat, this.ground);

    this.ground.setDepth(0);
    this.cat.setDepth(1);
    
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

        if (dx < 0) {
          this.cat.setFlipX(true);
        }
        else {
          this.cat.setFlipX(false);
        }

        if (dy > this.jumpThreshold) {
          this.cat.setVelocityY(-this.jumpHeight);
        }

        this.sy = y;
      }
    });

    this.input.on('pointerup', () => {
      this.sx = null;
      this.sy = null;
      this.cat.setVelocityX(0);
    });

    this.cameras.main.startFollow(this.cat);
    this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    this.cameras.main.setBackgroundColor(0x337788);
  }

  update(time, delta) {
    // console.log(delta);

    // Listen for keyboard input
    const {left, right, up, down} = this.cursors;
    const isGrounded = this.cat.body.blocked.down;

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
    }

    const {x: vx, y: vy} = this.cat.body.velocity;

    if (isGrounded) {
      this.cat.rotation = 0;

      if (vx === 0) {
        this.cat.play('tabby-idle', true);
      }
      else {
        this.cat.play('tabby-run', true);
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