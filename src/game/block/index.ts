import Vec from 'fast-vector';

export abstract class Block {
  state: {
    health: number;
    pos: Vec;
  };
  constructor(health: number, pos: Vec) {
    this.state = {
      health,
      pos,
    };
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
    return;
  }
}
export class Wall extends Block {}

export class PowerBlock extends Block {}
// export * from './weapon';
// export * from './resource';
