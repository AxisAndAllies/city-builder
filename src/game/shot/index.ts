import Vec from 'fast-vector';
import { fabric } from 'fabric';

export enum ShotType {
  BULLET,
  CANNONBALL,
}
const dmgStat = {
  [ShotType.BULLET]: 5,
  [ShotType.CANNONBALL]: 10,
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
      left: this.state.pos.x,
      top: this.state.pos.y,
      width: 16,
      height: 4,
      fill: 'yellow',
      angle: (angleRadians * 180) / Math.PI,
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

export class CannonBall extends Shot {
  constructor(
    initialPos: Vec,
    angleRadians: number,
    lifespanMs: number,
    speed: number,
  ) {
    super(initialPos, angleRadians, lifespanMs, speed, ShotType.CANNONBALL);
    this.sprite = new fabric.Rect({
      top: this.state.pos.x,
      left: this.state.pos.y,
      width: 14,
      height: 14,
      fill: 'salmon',
      angle: (angleRadians * 180) / Math.PI,
    });
    this.sprite.selectable = false;
  }
}
