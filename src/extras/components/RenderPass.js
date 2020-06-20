import { Component, Types } from "ecsy";

export class RenderPass extends Component {}

RenderPass.schema = {
  scene: { default: null, type: Types.Object },
  camera: { default: null, type: Types.Object }
};
