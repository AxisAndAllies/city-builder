import Vec from 'fast-vector';

export enum BulletType {
  BULLET,
}
const dmgStat = {
  [BulletType.BULLET]: 5,
};

const speedStat = {
  [BulletType.BULLET]: 5,
};

export class Shot {
  state: { vel: Vec; pos: Vec; lifespanMs: number; damage: number };
  constructor(
    initialPos: Vec,
    angleRadians: number,
    lifespanMs: number,
    bulletType: BulletType,
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
}
