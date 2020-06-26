import {Component, Types} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
export class RenderPass extends Component {
}
RenderPass.schema = {
  scene: {
    default: null,
    type: Types.Ref
  },
  camera: {
    default: null,
    type: Types.Ref
  }
};
