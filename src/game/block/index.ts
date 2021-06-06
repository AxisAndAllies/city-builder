export class Block {
  state: any;
  constructor(baseStats: { health: number }) {
    this.state.health = baseStats.health;
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
export * from './weapon';
export * from './resource';
