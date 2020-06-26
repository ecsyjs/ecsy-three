import {Component, Types} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
export class CameraRig extends Component {
}
CameraRig.schema = {
  leftHand: {
    default: null,
    type: Types.Ref
  },
  rightHand: {
    default: null,
    type: Types.Ref
  },
  camera: {
    default: null,
    type: Types.Ref
  }
};
