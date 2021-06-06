//@ts-check
import { Laser, MissileLauncher, RocketLauncher } from './block/weapon';

export class Game {
  constructor() {
    this.enemies = [];
    this.blocks = [];
  }
  start() {
    this.lastUpdated = Date.now();
    this.timer = setInterval(() => {
      let now = Date.now();
      this.loop(now - this.lastUpdated);
      this.lastUpdated = now;
    }, 100);
  }

  loop(elapsedMs) {
    this.ships.forEach((s) => {
      s.tick(elapsedMs);
    });
    // remove dead ships
    this.ships = this.ships.filter((s) => s.state.health > 0);
    if (Math.random() < 0.02)
      console.log(
        this.ships,
        this.ships.map((s) => s.state.health),
      );
    if (this.ships.length == 1) {
      this.exit();
    }
  }

  exit() {
    clearInterval(this.timer);
  }
}
