import { Component, RefPropType } from "ecsy";
import { ECSYThreeEntity } from "../entity";
import { WebGLRenderer, Object3D, Camera } from "three";

export class WebGLRendererComponent extends Component<WebGLRendererComponent> {
  renderer: WebGLRenderer;
  scene: ECSYThreeEntity;
  camera: ECSYThreeEntity;

  static schema: {
    renderer: { type: RefPropType<WebGLRenderer> },
    scene: { type: RefPropType<Object3D> },
    camera: { type: RefPropType<Camera> },
  };
}