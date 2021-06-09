import { Block } from './block';
import { Weapon } from './block/weapon';
import { Enemy } from './enemy';
import { fabric } from 'fabric';
import { Shot } from './shot';

//@ts-check
export class Game {
  readonly state: {
    enemies: Enemy[];
    blocks: Block[];
    shots: Shot[];
    lastUpdated: number;
    timer: number;
  };
  readonly canvas: fabric.Canvas;
  renderFunc: () => void;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.state = {
      enemies: [],
      blocks: [],
      shots: [],
      lastUpdated: Date.now(),
      timer: 0,
    };
    this.renderFunc = this.render.bind(this);
  }
  start() {
    requestAnimationFrame(this.renderFunc);

    this.state.timer = setInterval(() => {
      let now = Date.now();
      this.loop(now - this.state.lastUpdated);
      this.state.lastUpdated = now;
    }, 100);
  }
  addBlock(block: Block) {
    this.state.blocks.push(block);
    this.canvas.add(block.sprite);
  }
  addEnemy(enemy: Enemy) {
    this.state.enemies.push(enemy);
    this.canvas.add(enemy.sprite);
  }
  addShots(shots: Shot[]) {
    shots && this.state.shots.push(...shots);
    shots.forEach((s) => this.canvas.add(s.sprite));
  }

  loop(elapsedMs: number) {
    this.state.blocks.forEach((s) => {
      if (s instanceof Weapon) {
        s.findTarget(this.state.enemies);
      }
      s.tick(elapsedMs);
    });
    this.state.enemies.forEach((e) => {
      e.tick(elapsedMs);
    });
    this.state.shots.forEach((e) => {
      e.tick(elapsedMs);
    });
    this.state.shots = this.state.shots.filter((s) => !s.isDead());
    this.state.enemies = this.state.enemies.filter((s) => !s.isDead());
    this.state.blocks = this.state.blocks.filter((s) => !s.isDead());
  }

  render() {
    //NOTE: fabric performance tips https://github.com/fabricjs/fabric.js/wiki/Optimizing-performance
    this.state.blocks.map((b) => {
      b.render();
    });
    this.state.shots.map((s) => {
      s.render();
    });
    this.state.enemies.map((e) => {
      e.render();
    });
    this.canvas.renderAll();
    window.requestAnimationFrame(this.renderFunc);
  }

  exit() {
    clearInterval(this.state.timer);
  }
}
