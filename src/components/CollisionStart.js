export class CollisionStart {
  constructor() {
    this.collidingWith = [];
  }
  reset() {
    this.collidingWith.length = 0;
  }
}
