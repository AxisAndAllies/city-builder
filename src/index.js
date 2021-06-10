//@ts-check
import { fabric } from 'fabric';
import { Game } from './game';
import Vec from 'fast-vector';
import { Cannon, Minigun, Shotgun } from './game/block/weapon';
import { SimpleEnemy, SmallEnemy } from './game/enemy';
import { Resource, ResourceType } from './game/block/resource';
import { Wall } from './game/block';

const WIDTH = 1600;
const HEIGHT = 1200;
export const GRID_SIZE = 20;

let canvas = new fabric.Canvas('canvas', { width: WIDTH, height: HEIGHT });
// perf things
canvas.selection = false;
canvas.skipOffscreen = true;
// canvas.skipTargetFind = true;
canvas.renderOnAddRemove = false;
canvas.fireMiddleClick = true;
canvas.fireRightClick = true;

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

canvas.backgroundColor = '#333';
canvas.hoverCursor = 'none';

export const roundToGrid = (x, y) => {
  return new Vec(
    Math.round(x / GRID_SIZE) * GRID_SIZE,
    Math.round(y / GRID_SIZE) * GRID_SIZE,
  );
};

let cursor = new fabric.Rect({
  left: 0,
  top: 0,
  stroke: 'white',
  width: GRID_SIZE,
  height: GRID_SIZE,
  selectable: false,
  hasRotatingPoint: false,
});
canvas.add(cursor);

let game = new Game(canvas);

function calcPlacement(offsetX, offsetY, viewportTransform, zoom) {
  let realX = offsetX - viewportTransform[4];
  let realY = offsetY - viewportTransform[5];
  return roundToGrid(realX / zoom, realY / zoom);
}
canvas.on('mouse:wheel', function (opt) {
  if (!opt.e.shiftKey) {
    return;
  }
  let delta = opt.e.deltaY;
  let zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 5) zoom = 5;
  if (zoom < 0.2) zoom = 0.2;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});
canvas.on('mouse:down', function (opt) {
  let evt = opt.e;
  opt.e.preventDefault();
  opt.e.stopPropagation();
  if (opt.button === 2) {
    // middle click drag
    this.isDragging = true;
    this.selection = false;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
  } else if (opt.button === 1) {
    // left click

    let placement = calcPlacement(
      opt.e.offsetX,
      opt.e.offsetY,
      this.viewportTransform,
      canvas.getZoom(),
    ).sub(new Vec(0, 2 * GRID_SIZE));

    game.addBlock(
      new Wall(
        // need to subtract a bit to make it seem like it's added directly under the mouse
        placement,
      ),
    );
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
  } else {
    let placement = calcPlacement(
      opt.e.offsetX,
      opt.e.offsetY,
      this.viewportTransform,
      canvas.getZoom(),
    ).sub(new Vec(0, 2 * GRID_SIZE));
    cursor.set({ left: placement.x, top: placement.y });
  }
});
canvas.on('mouse:up', function (opt) {
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  this.setViewportTransform(this.viewportTransform);
  this.isDragging = false;
  this.selection = true;
});

game.addBlock(new Cannon(new Vec(500, 500)));
game.addBlock(new Minigun(new Vec(600, 300)));
game.addBlock(new Minigun(new Vec(200, 300)));
game.addBlock(new Minigun(new Vec(300, 300)));
game.addBlock(new Minigun(new Vec(400, 200)));
game.addBlock(new Minigun(new Vec(600, 700)));
game.addBlock(new Shotgun(new Vec(400, 600)));

for (let i = 0; i < 30; i++) {
  game.addBlock(new Wall(new Vec(i * GRID_SIZE + 20, 700)));
  game.addBlock(new Wall(new Vec(i * GRID_SIZE + 200, 500)));
  game.addBlock(new Wall(new Vec(i * GRID_SIZE + 500, 300)));
}
for (let i = 0; i < 10; i++) {
  let x = Math.random() * WIDTH;
  let y = Math.random() * HEIGHT;
  game.addBlock(new Resource(roundToGrid(x, y), 10, ResourceType.IRON));
  for (let j = 0; j < Math.random() * 20; j++) {
    let x2 = Math.random() * 150 - 75 + x;
    let y2 = Math.random() * 150 - 75 + y;
    game.addBlock(new Resource(roundToGrid(x2, y2), 10, ResourceType.IRON));
  }
}
game.addEnemy(new SimpleEnemy(new Vec(100, 100), Math.PI / 2.9));
game.addEnemy(new SmallEnemy(new Vec(100, 700), -Math.PI / 2.9));
game.addEnemy(new SmallEnemy(new Vec(700, 100), -Math.PI * 1.5));
game.start();
