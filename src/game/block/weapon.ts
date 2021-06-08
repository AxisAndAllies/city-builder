//@ts-check
import { Block } from '.';
import Vec from 'fast-vector';
import { Bullet, Shot } from '../shot';
import { Enemy } from '../enemy';

type WeaponStat = {
    health: number;
    reload: number;
    damage: number;
    range: number;
    bulletSpeed: number;
    spreadRadians: number;
    numShots: number;
  }

export abstract class Weapon extends Block {
  // current state
  state: {
    pos: Vec;
    target: null;
  } & WeaponStat;
  // base stats
  baseStat:WeaponStat  = {
    health: 0,
    reload: 0,
    damage: 0,
    range: 0,
    bulletSpeed: 0,
    spreadRadians: 0,
    numShots: 0,
  };
  constructor(pos: Vec) {
    super(0, pos);
    this.state = {
      pos,
      target: null,
      ...this.baseStat,
      reload: 0, // all weapons come ready to fire
    };
  }

  get readyToFire() {
    return this.state.reload == 0;
  }

  findTarget(enemies: Enemy[]) {
    
  }

  tick(ms: number) {
    this.state.reload = Math.max(this.state.reload - ms, 0);
  }
  fire(targetPos: Vec) {
    // reset reload
    this.state.reload = this.baseStat.reload;

    let shots: Shot[] = [];
    for (let i = 0; i < this.state.numShots; i++) {
      shots.push(new Bullet(this.state.pos, targetPos.sub(this.state.pos).angle(), this.state.range/this.);
    }
    // returns damage
    return shots;
  }
}

export class 

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
