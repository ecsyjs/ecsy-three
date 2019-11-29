import { createComponentClass } from "ecsy";

export { Active } from "./Active.js";
export { CameraRig } from "./CameraRig.js";
export { Draggable } from "./Draggable.js";
export { Dragging } from "./Dragging.js";
export { Geometry } from "./Geometry.js";
export { GLTFModel } from "./GLTFModel.js";
export { Material } from "./Material.js";
export { Object3D } from "./Object3D.js";
export { Parent } from "./Parent.js";
export { Position } from "./Position.js";
export { RenderPass } from "./RenderPass.js";
export { Rotation } from "./Rotation.js";
export { Scene } from "./Scene.js";
export { Sky } from "./Sky.js";
export { SkyBox } from "./Skybox.js";
export { TextGeometry } from "./TextGeometry.js";
export { Transform } from "./Transform.js";
export { Visible } from "./Visible.js";
export { VRController } from "./VRController.js";

export class Camera {
  constructor() {
    this.fov = 45;
    this.aspect = 1;
    this.near = 1;
    this.far = 1000;
    this.layers = 0;
    this.handleResize = true;
  }
}

export class WebGLRenderer {
  constructor() {
    this.vr = true;
    this.antialias = true;
    this.handleResize = true;
    this.gammaInput = true;
    this.gammaOutput = true;
    this.shadowMap = false;
  }
}


/*
export const WebGLRenderer = createComponentClass(
  {
    vr: { default: true },
    antialias: { default: true },
    handleResize: { default: true },
    gammaInput: { default: true },
    gammaOutput: { default: true },
    shadowMap: { default: false }
  },
  "WebGLRenderer"
);
*/