import { Block } from '.';
import Vec from 'fast-vector';

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
  }
}
