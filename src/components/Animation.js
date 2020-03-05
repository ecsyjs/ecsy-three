export class Animation {
  constructor() {
    this.animations = [];
    this.duration = -1;
  }

  reset() {
    this.animations.length = 0;
    this.duration = -1;
  }
}
