export class InputState {
  constructor() {
    this.vrcontrollers = new Map();
    this.keyboard = {};
    this.mouse = {};
    this.gamepads = {};
  }

  reset() {}
}
