import { GameObjects } from "phaser";
const { Sprite } = GameObjects;

class Birb extends Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'birb');

    this.scene = scene;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.body.setAllowGravity(false);

    this.play('birb-flap');
  }
}

export default Birb;