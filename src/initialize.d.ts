import { ECSYThreeWorld } from "./world.js";
import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { ECSYThreeEntity } from "./entity.js";

export interface InitializeOptions {
  renderer?: WebGLRenderer;
  animationLoop?: Function
}

export function initialize(world: ECSYThreeWorld, options?: InitializeOptions) : {
  world: ECSYThreeWorld,
  camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  sceneEntity: ECSYThreeEntity,
  cameraEntity: ECSYThreeEntity,
  rendererEntity: ECSYThreeEntity
}
