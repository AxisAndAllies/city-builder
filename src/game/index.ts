import { Block } from './block';
import { Weapon } from './block/weapon';
import { Enemy } from './enemy';
import { Shot } from './shot';

//@ts-check
export class Game {
  state: {
    enemies: Enemy[];
    blocks: Block[];
    shots: Shot[];
    lastUpdated: number;
    timer: number;
  };

  constructor() {
    this.state = {
      enemies: [],
      blocks: [],
      shots: [],
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

    requestAnimationFrame(this.render);
  }
  addBlock(block: Block) {
    this.state.blocks.push(block);
  }
  addEnemy(enemy: Enemy) {
    this.state.enemies.push(enemy);
  }
  addShots(shots: Shot[]) {
    shots && this.state.shots.push(...shots);
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

  render() {
    //draw
    this.state.blocks.map((b) => {
      b.render();
    });
    this.state.shots.map((s) => {
      s.render();
    });
    this.state.enemies.map((e) => {
      e.render();
    });
    window.requestAnimationFrame(this.render);
  }

  exit() {
    clearInterval(this.state.timer);
  }
}
