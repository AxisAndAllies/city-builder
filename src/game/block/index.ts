import { fabric } from 'fabric';
import Vec from 'fast-vector';

export abstract class Block {
  state: {
    health: number;
    pos: Vec;
  };
  sprite: fabric.Object;
  constructor(health: number, pos: Vec) {
    this.state = {
      health,
      pos,
    };

    this.sprite = new fabric.Rect({
      left: this.state.pos.x,
      top: this.state.pos.y,
      width: 10,
      height: 10,
      fill: 'white',
    });
  }
  takeDamage(dmg: number) {
    this.state.health -= dmg;
  }
  isDead() {
    return this.state.health <= 0;
  }
  tick(_: number) {
    return;
  }
  render() {
    this.sprite.set({
      // int values for better perf
      left: Math.floor(this.state.pos.x),
      top: Math.floor(this.state.pos.y),
    });
  }
}
export class Wall extends Block {}

export class PowerBlock extends Block {}
// export * from './weapon';
// export * from './resource';
