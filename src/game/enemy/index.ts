import { fabric } from 'fabric';
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
  sprite: fabric.Object;
  constructor(pos: Vec, vel: Vec) {
    this.state = {
      id: alphanumericId(8),
      vel,
      pos,
      ...this.baseStat,
    };

    this.sprite = new fabric.Rect({
      top: this.state.pos.x,
      left: this.state.pos.y,
      width: 50,
      height: 50,
      fill: '#aaa',
    });
  }
  tick(ms: number) {
    this.state.pos = this.state.pos.add(this.state.vel.div(ms / 1000));
  }
  render() {
    this.sprite.set({ top: this.state.pos.x, left: this.state.pos.y });
  }
  isDead() {
    return this.state.health <= 0;
  }
}

export class SimpleEnemy extends Enemy {
  baseStat: EnemyStat = {
    health: 10,
    speed: 10,
    damage: 10,
  };
}
