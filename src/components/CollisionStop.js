export class CollisionStop {
  constructor() {
    this.collidingWith = [];
  }
  reset() {
    this.collidingWith.length = 0;
  }
}
