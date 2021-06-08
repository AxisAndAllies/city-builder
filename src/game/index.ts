import { Block, Weapon } from './block';
import { Enemy } from './enemy';

//@ts-check
export class Game {
  state: {
    enemies: Enemy[];
    blocks: Block[];
    lastUpdated: number;
    timer: number;
  };

  constructor() {
    this.state = {
      enemies: [],
      blocks: [],
      lastUpdated: Date.now(),
      timer: 0,
    };
  }
  start() {
    this.state.timer = setInterval(() => {
      let now = Date.now();
      this.loop(now - this.state.lastUpdated);
      this.state.lastUpdated = now;
    }, 100);
  }

  /**
   * @param {number} elapsedMs
   */
  loop(elapsedMs: number) {
    this.state.blocks.forEach((s) => {
      if (s instanceof Weapon) {
        s.findTarget(this.state.enemies);
      }
      s.tick(elapsedMs);
    });
    this.state.blocks = this.state.blocks.filter((s) => !s.isDead());
  }

  exit() {
    clearInterval(this.state.timer);
  }
}
