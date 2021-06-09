//@ts-check
import { fabric } from 'fabric';
import { Game } from './game';
import Vec from 'fast-vector';
import { Cannon, Minigun } from './game/block/weapon';
import { SimpleEnemy } from './game/enemy';

let canvas = new fabric.Canvas('canvas');
canvas.selection = false;
canvas.on('mouse:wheel', function (opt) {
  let delta = opt.e.deltaY;
  let zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

canvas.on('mouse:down', function (opt) {
  let evt = opt.e;
  opt.e.preventDefault();
  opt.e.stopPropagation();
  if (evt.altKey === true) {
    this.isDragging = true;
    this.selection = false;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
  }
});
canvas.on('mouse:move', function (opt) {
  if (this.isDragging) {
    let e = opt.e;
    let vpt = this.viewportTransform;
    vpt[4] += e.clientX - this.lastPosX;
    vpt[5] += e.clientY - this.lastPosY;
    this.requestRenderAll();
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
  }
});
canvas.on('mouse:up', function (opt) {
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  this.setViewportTransform(this.viewportTransform);
  this.isDragging = false;
  this.selection = true;
});

let rect = new fabric.Rect({
  top: 100,
  left: 100,
  width: 90,
  height: 40,
  fill: '#a3e',
  // selectable: false,
});
let r2 = new fabric.Rect({
  top: 400,
  left: 400,
  width: 90,
  height: 40,
  fill: '#4ea',
  // selectable: false,
});

console.log(rect.originX, rect.originY);

function makeLaser(r1, r2) {
  let line = new fabric.Line(
    [
      r1.getCenterPoint().x,
      r1.getCenterPoint().y,
      r2.getCenterPoint().x,
      r2.getCenterPoint().y,
    ],
    {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    },
  );
  let gradient = new fabric.Gradient({
    type: 'linear',
    gradientUnits: 'percentage', // or 'percentage'
    coords: { x1: 0, y1: 0, x2: 0, y2: 2 },
    colorStops: [
      { offset: 0, color: r1.fill },
      { offset: 0.5, color: 'yellow' },
    ],
  });
  line.set('stroke', gradient);
  return line;
}

let text = new fabric.Text('Hello world', {
  left: 100,
  top: 200,
  fill: '#f55',
  fontFamily: 'Ubuntu',
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontSize: 12,
  // angle: 15,
  selectable: false,
});
// canvas.add(text);

// canvas.add(rect);
// canvas.add(r2);
// canvas.add(makeLaser(rect, r2));
// canvas.add(makeLaser(r2, rect));
canvas.backgroundColor = '#333';

let game = new Game(canvas);
game.addBlock(new Cannon(new Vec(500, 500)));
game.addBlock(new Minigun(new Vec(600, 300)));
game.addEnemy(new SimpleEnemy(new Vec(100, 100), Math.PI / 2.9));
game.start();
