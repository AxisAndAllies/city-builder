import { Block } from '.';
import Vec from 'fast-vector';
import { fabric } from 'fabric';
import { GRID_SIZE } from '../..';

export enum ResourceType {
  IRON,
}
export class Resource extends Block {
  amount: number;
  type: ResourceType;
  constructor(pos: Vec, amount: number, type: ResourceType) {
    let health = amount;
    super(health, pos);
    this.amount = amount;
    this.type = type;
    this.sprite = new fabric.Rect({
      left: this.state.pos.x,
      top: this.state.pos.y,
      width: GRID_SIZE,
      height: GRID_SIZE,
      fill: '#4ea',
    });
    this.sprite.selectable = false;
  }
}
