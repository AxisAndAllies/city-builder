//@ts-check
export class Game {
  constructor() {
    this.enemies = [];
    /** @type {any[]} */
    this.blocks = [];
  }
  start() {
    this.lastUpdated = Date.now();
    this.timer = setInterval(() => {
      let now = Date.now();
      // @ts-ignore
      this.loop(now - this.lastUpdated);
      this.lastUpdated = now;
    }, 100);
  }

  /**
   * @param {number} elapsedMs
   */
  loop(elapsedMs) {
    this.blocks.forEach((s) => {
      s.tick(elapsedMs);
    });
    // remove dead ships
    this.blocks = this.blocks.filter((s) => s.state.health > 0);
    if (Math.random() < 0.02)
      console.log(
        this.blocks,
        this.blocks.map((s) => s.state.health),
      );
    if (this.blocks.length == 1) {
      this.exit();
    }
  }

  exit() {
    clearInterval(this.timer);
  }
}
