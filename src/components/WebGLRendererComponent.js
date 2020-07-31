import { Component, Types } from "ecsy";
import { WebGLRenderer } from "three";
import { ECSYThreeEntity } from "../entity.js";

export class WebGLRendererComponent extends Component {}
WebGLRendererComponent.schema = {
  renderer: { type: Types.Ref },
  scene: { type: Types.Ref },
  camera: { type: Types.Ref },
};
