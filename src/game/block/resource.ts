export enum ResourceType {
  IRON,
}
export class Resource {
  amount: number;
  type: ResourceType;
  constructor(amount: number, type: ResourceType) {
    this.amount = amount;
    this.type = type;
  }
}
