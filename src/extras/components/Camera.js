import { Component, Types } from "ecsy";

export class Camera extends Component {}

Camera.schema = {
  fov: { default: 45, type: Types.Number },
  aspect: { default: 1, type: Types.Number },
  near: { default: 0.1, type: Types.Number },
  far: { default: 1000, type: Types.Number },
  layers: { default: 0, type: Types.Number },
  handleResize: { default: true, type: Types.Boolean }
};
