import { fabric } from 'fabric';
import Vec from 'fast-vector';
import { GRID_SIZE } from '../..';

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
      width: GRID_SIZE,
      height: GRID_SIZE,
      fill: 'lightgray',
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
export class Wall extends Block {
  constructor(pos: Vec) {
    super(10, pos);
    this.sprite.selectable = false;
  }
}

export class PowerBlock extends Block {}
// export * from './weapon';
// export * from './resource';
