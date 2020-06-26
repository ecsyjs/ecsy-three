import {Component, Types} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
export class WebGLRenderer extends Component {
}
WebGLRenderer.schema = {
  vr: {
    default: false,
    type: Types.Boolean
  },
  ar: {
    default: false,
    type: Types.Boolean
  },
  antialias: {
    default: true,
    type: Types.Boolean
  },
  handleResize: {
    default: true,
    type: Types.Boolean
  },
  shadowMap: {
    default: true,
    type: Types.Boolean
  },
  animationLoop: {
    default: null,
    type: Types.Ref
  }
};
