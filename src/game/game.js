import { Laser, MissileLauncher, RocketLauncher } from './parts/weapon';
import { Destroyer, Gunship } from './ship';

export class Game {
  constructor() {
    this.ships = [];
    let a = new Destroyer();
    a.addEquipment(new MissileLauncher());
    a.addEquipment(new RocketLauncher());
    // a.addEquipment(new LightShield());

    let b = new Gunship();
    b.addEquipment(new Laser());
    // b.addEquipment(new Laser());
    // b.addEquipment(new MediumShield());

    a.setTarget(b);
    b.setTarget(a);

    this.ships.push(a);
    this.ships.push(b);
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
