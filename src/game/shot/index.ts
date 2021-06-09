import Vec from 'fast-vector';

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
  }
  tick(ms: number) {
    this.state.pos = this.state.pos.add(this.state.vel.div(ms / 1000));
    this.state.lifespanMs -= ms;
  }
  render() {}
}
export class Bullet extends Shot {
  constructor(initialPos: Vec, angleRadians: number, lifespanMs: number) {
    super(initialPos, angleRadians, lifespanMs, ShotType.BULLET);
  }
}
