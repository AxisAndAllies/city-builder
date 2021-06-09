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
      width: 40,
      height: 40,
      fill: '#4ea',
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
    this.sprite.set({ left: this.state.pos.x, top: this.state.pos.y });
  }
}
export class Wall extends Block {}

export class PowerBlock extends Block {}
// export * from './weapon';
// export * from './resource';
