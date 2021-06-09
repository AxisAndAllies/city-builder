import Vec from 'fast-vector';
import { fabric } from 'fabric';

export enum ShotType {
  BULLET,
}
const dmgStat = {
  [ShotType.BULLET]: 5,
};

const speedStat = {
  [ShotType.BULLET]: 5,
};

export abstract class Shot {
  state: { vel: Vec; pos: Vec; lifespanMs: number; damage: number };
  sprite: fabric.Object;
  constructor(
    initialPos: Vec,
    angleRadians: number,
    lifespanMs: number,
    bulletType: ShotType,
  ) {
    const vel = new Vec(Math.cos(angleRadians), Math.sin(angleRadians)).mul(
      speedStat[bulletType],
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
      width: 20,
      height: 20,
      fill: '#e92',
    });
  }
  tick(ms: number) {
    this.state.pos = this.state.pos.add(this.state.vel.div(ms / 1000));
    this.state.lifespanMs -= ms;
  }
  render() {
    this.sprite.set({ top: this.state.pos.x, left: this.state.pos.y });
  }
}
export class Bullet extends Shot {
  constructor(initialPos: Vec, angleRadians: number, lifespanMs: number) {
    super(initialPos, angleRadians, lifespanMs, ShotType.BULLET);
  }
}
