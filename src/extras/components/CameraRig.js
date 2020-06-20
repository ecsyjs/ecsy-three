import { Component, Types } from "ecsy";

export class CameraRig extends Component {}
CameraRig.schema = {
  leftHand: { default: null, type: Types.Object },
  rightHand: { default: null, type: Types.Object },
  camera: { default: null, type: Types.Object }
};
