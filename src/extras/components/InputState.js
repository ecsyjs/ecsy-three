import {Component, Types} from "/web_modules/ecsy.js";
export class InputState extends Component {
}
InputState.schema = {
  vrcontrollers: {
    default: new Map(),
    type: Types.Ref
  },
  keyboard: {
    default: {},
    type: Types.Ref
  },
  mouse: {
    default: {},
    type: Types.Ref
  },
  gamepads: {
    default: {},
    type: Types.Ref
  }
};
