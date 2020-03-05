export class Colliding {
  constructor() {
    this.collidingWith = [];
    this.collidingFrame = 0;
  }
  reset() {
    this.collidingWith.length = 0;
    this.collidingFrame = 0;
  }
}
