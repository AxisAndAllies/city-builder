//@ts-check
import { Block } from '.';
import Vec from 'fast-vector';
import { Bullet, Shot } from '../shot';
import { Enemy } from '../enemy';
import { getDiffVec, getDistSq, TWO_PI } from '../utils';
import { fabric } from 'fabric';

type WeaponStat = {
  health: number;
  reload: number; // millis
  damage: number;
  range: number;
  turnSpeed: number; // radians per sec
  bulletSpeed: number;
  spreadRadians: number;
  numShots: number;
};

export abstract class Weapon extends Block {
  // current state
  state: {
    pos: Vec;
    orientation: number;
    target: Enemy | null;
  } & WeaponStat;
  // base stats
  baseStat: WeaponStat;
  constructor(pos: Vec, baseStat: WeaponStat) {
    super(0, pos);
    this.state = {
      pos,
      orientation: 0,
      target: null,
      ...baseStat,
      reload: 0, // all weapons come ready to fire
    };
    this.baseStat = baseStat;
  }

  get readyToFire() {
    return this.state.reload == 0;
  }
  private setTarget(enemy: Enemy) {
    this.state.target = enemy;
  }

  findTarget(enemies: Enemy[]) {
    // optimize later lol
    // just get closest enemy for now
    if (!enemies.length) {
      return;
    }
    let minDistSq = getDistSq(this, enemies[0]);
    this.setTarget(enemies[0]);
    for (let i = 0; i < enemies.length; i++) {
      let d = getDistSq(this, enemies[i]);
      if (d < minDistSq) {
        minDistSq = d;
        this.setTarget(enemies[i]);
      }
    }
  }

  tick(ms: number) {
    this.state.reload = Math.max(this.state.reload - ms, 0);

    if (!this.state.target) {
      return;
    }
    // shoot if aligned + in range + reloaded
    let vec = getDiffVec(this, this.state.target);
    this.turnTowards(vec.angle(), ms);
    if (
      // true
      Math.abs(vec.angle() - this.state.orientation) % TWO_PI < 0.1 &&
      vec.magnitude() < this.state.range &&
      this.state.reload <= 0
    ) {
      // console.log(this.id, " fired a shot at ", targ);
      return this.tryFire();
    }
  }
  turnTowards(angRadians: number, ms: number) {
    // optimal turning algorithm
    // from https://math.stackexchange.com/questions/1366869/calculating-rotation-direction-between-two-angless
    let cur_ang = this.state.orientation;
    let turn = (this.state.turnSpeed * ms) / 1000;
    let angdiff = cur_ang - angRadians;
    if (angdiff > Math.PI) angdiff -= TWO_PI;
    if (angdiff <= -Math.PI) angdiff += TWO_PI;

    let minturn = Math.min(Math.abs(angdiff), turn);
    if (angdiff > 0) {
      this.state.orientation -= minturn;
    } else if (angdiff < 0) {
      this.state.orientation += minturn;
    }
  }

  private tryFire() {
    if (this.state.reload > 0) {
      return;
    }
    // reset reload
    this.state.reload = this.baseStat.reload;

    let shots: Shot[] = [];
    for (let i = 0; i < this.state.numShots; i++) {
      let ang =
        this.state.orientation +
        (Math.random() - 0.5) * this.state.spreadRadians;
      shots.push(
        new Bullet(
          this.state.pos,
          ang,
          (this.state.range / this.state.bulletSpeed) * 1000,
          this.state.bulletSpeed,
        ),
      );
    }
    // returns damage
    return shots;
  }
  render() {
    this.sprite.set({ left: this.state.pos.x, top: this.state.pos.y });
    this.sprite.rotate((this.state.orientation * 180) / Math.PI);
  }
}

export class Minigun extends Weapon {
  constructor(pos: Vec) {
    let baseStat: WeaponStat = {
      health: 10,
      reload: 200,
      damage: 2,
      range: 250,
      turnSpeed: Math.PI / 2,
      bulletSpeed: 150,
      spreadRadians: 0.15,
      numShots: 1,
    };
    super(pos, baseStat);

    this.sprite = new fabric.Rect({
      left: this.state.pos.x,
      top: this.state.pos.y,
      width: 25,
      height: 25,
      fill: '#e2a',
    });
  }
}
export class Cannon extends Weapon {
  constructor(pos: Vec) {
    let baseStat: WeaponStat = {
      health: 10,
      reload: 1000,
      damage: 10,
      range: 400,
      turnSpeed: Math.PI / 2,
      bulletSpeed: 80,
      spreadRadians: 0.05,
      numShots: 1,
    };
    super(pos, baseStat);

    this.sprite = new fabric.Rect({
      left: this.state.pos.x,
      top: this.state.pos.y,
      width: 30,
      height: 45,
      fill: '#2ae',
    });
  }
}

export class Shotgun extends Weapon {
  constructor(pos: Vec) {
    let baseStat: WeaponStat = {
      health: 10,
      reload: 1400,
      damage: 4,
      range: 240,
      turnSpeed: Math.PI * 0.7,
      bulletSpeed: 220,
      spreadRadians: 0.5,
      numShots: 9,
    };
    super(pos, baseStat);

    this.sprite = new fabric.Rect({
      left: this.state.pos.x,
      top: this.state.pos.y,
      width: 35,
      height: 20,
      fill: '#bb2',
    });
  }
}

// export class Laser extends Weapon {
//   constructor() {
//     super();
//     this.initializeState();
//   }
//   // continuous firing s
//   baseStat = {
//     damage: 7,
//     reload: 1000, // in reality fires every 1 sec lol
//     range: 10,
//     spreadRadians: 1.0,
//     numShots: 1,
//   };
// }

// export class Railgun extends Weapon {
//   constructor() {
//     super();
//     this.initializeState();
//   }
//   // ultra long range
//   baseStat = {
//     damage: 24,
//     reload: 5000,
//     range: 15,
//     spreadRadians: 0.8,
//     numShots: 1,
//   };
// }

// export class Cannon extends Weapon {
//   constructor() {
//     super();
//     this.initializeState();
//   }
//   // TODO: ignores shield?
//   baseStat = {
//     damage: 8,
//     reload: 3000,
//     range: 10,
//     spreadRadians: 0.5,
//     numShots: 3,
//   };
// }

// export class MissileLauncher extends Weapon {
//   constructor() {
//     super();
//     this.initializeState();
//   }
//   // guided missile
//   baseStat = {
//     damage: 18,
//     reload: 2000,
//     range: 15,
//     spreadRadians: 0.9,
//     numShots: 1,
//   };
// }

// export class RocketLauncher extends Weapon {
//   constructor() {
//     super();
//     this.initializeState();
//   }
//   // unguided, can fire volley?
//   // maybe save up for burst volley
//   baseStat = {
//     damage: 20,
//     reload: 15000,
//     range: 6,
//     spreadRadians: 0.6,
//     numShots: 12,
//   };
// }
