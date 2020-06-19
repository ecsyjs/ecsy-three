import { Component, Types } from "ecsy";

export class InputState extends Component {}

InputState.schema = {
  vrcontrollers: { default: new Map(), type: Types.Object },
  keyboard: { default: {}, type: Types.Object },
  mouse: { default: {}, type: Types.Object },
  gamepads: { default: {}, type: Types.Object }
};
