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
  baseStat: EnemyStat;
  sprite: fabric.Object;
  constructor(pos: Vec, angleRadians: number, baseStat: EnemyStat) {
    const vel = new Vec(Math.cos(angleRadians), Math.sin(angleRadians)).mul(
      baseStat.speed,
    );
    this.state = {
      id: alphanumericId(8),
      vel,
      pos,
      ...baseStat,
    };
    this.baseStat = baseStat;

    this.sprite = new fabric.Rect({
      left: this.state.pos.x,
      top: this.state.pos.y,
      width: 50,
      height: 50,
      fill: '#aaa',
      hasControls: false,
      hasBorders: false,
    });
  }
  tick(ms: number) {
    // console.log(this.state.pos);
    // this.state.pos = this.state.pos.add(this.state.vel.mul(ms / 1000));
    this.state.pos = new Vec(this.sprite?.left, this.sprite?.top);
  }
  render() {
    // this.sprite.set({ left: this.state.pos.x, top: this.state.pos.y });
  }
  isDead() {
    return this.state.health <= 0;
  }
}

export class SimpleEnemy extends Enemy {
  constructor(pos: Vec, angleRadians: number) {
    let baseStat: EnemyStat = {
      health: 10,
      speed: 50,
      damage: 10,
    };
    super(pos, angleRadians, baseStat);
  }
}

export class SmallEnemy extends Enemy {
  constructor(pos: Vec, angleRadians: number) {
    let baseStat: EnemyStat = {
      health: 10,
      speed: 50,
      damage: 10,
    };
    super(pos, angleRadians, baseStat);
    this.sprite = new fabric.Rect({
      left: this.state.pos.x,
      top: this.state.pos.y,
      width: 20,
      height: 20,
      fill: '#e92',
      hasControls: false,
      hasBorders: false,
    });
  }
}
