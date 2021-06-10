import Vec from 'fast-vector';
import { fabric } from 'fabric';

export enum ShotType {
  BULLET,
}
const dmgStat = {
  [ShotType.BULLET]: 5,
};

export abstract class Shot {
  state: { vel: Vec; pos: Vec; lifespanMs: number; damage: number };
  sprite: fabric.Object;
  constructor(
    initialPos: Vec,
    angleRadians: number,
    lifespanMs: number,
    speed: number,
    bulletType: ShotType,
  ) {
    const vel = new Vec(Math.cos(angleRadians), Math.sin(angleRadians)).mul(
      speed,
    );
    this.state = {
      vel,
      pos: initialPos,
      lifespanMs,
      damage: dmgStat[bulletType],
    };

    this.sprite = new fabric.Rect({
      top: this.state.pos.x,
      left: this.state.pos.y,
      width: 12,
      height: 12,
      fill: '#e92',
    });
    this.sprite.selectable = false;
  }
  tick(ms: number) {
    this.state.pos = this.state.pos.add(this.state.vel.mul(ms / 1000));
    this.state.lifespanMs -= ms;
  }
  isDead() {
    return this.state.lifespanMs <= 0;
  }
  render() {
    this.sprite.set({
      // int values for better perf
      left: Math.floor(this.state.pos.x),
      top: Math.floor(this.state.pos.y),
    });
  }
}
export class Bullet extends Shot {
  constructor(
    initialPos: Vec,
    angleRadians: number,
    lifespanMs: number,
    speed: number,
  ) {
    super(initialPos, angleRadians, lifespanMs, speed, ShotType.BULLET);
  }
}
