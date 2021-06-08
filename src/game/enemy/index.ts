import Vec from 'fast-vector';
import { alphanumericId } from 'short-animal-id';

type EnemyStat = {
  health: number;
  speed: number;
  damage: number;
};

export abstract class Enemy {
  state: {
    id: string;
    vel: Vec;
    pos: Vec;
  } & EnemyStat;
  baseStat: EnemyStat = {
    health: 0,
    speed: 0,
    damage: 0,
  };
  constructor(pos: Vec, vel: Vec) {
    this.state = {
      id: alphanumericId(8),
      vel,
      pos,
      ...this.baseStat,
    };
  }
  tick(ms: number) {
    this.state.pos = this.state.pos.add(this.state.vel.div(ms / 1000));
  }
}

export class SimpleEnemy extends Enemy {
  baseStat = {
    health: 10,
    speed: 10,
    damage: 10,
  };
}
