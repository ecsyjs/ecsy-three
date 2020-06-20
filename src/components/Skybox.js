import { Component, Types } from "ecsy";

export class SkyBox extends Component {}
SkyBox.schema = {
  texture: { default: null, type: Types.Object },
  type: { default: 0, type: Types.Number }
};
