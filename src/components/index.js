import { createComponentClass } from "ecsy";

export { Scene } from "./Scene.js";
export { Parent } from "./Parent.js";
export { SkyBox } from "./Skybox.js";
export { Object3D } from "./Object3D.js";
export { Visible } from "./Visible.js";
export { CameraRig } from "./CameraRig.js";
export { Draggable } from "./Draggable.js";
export { Dragging } from "./Dragging.js";
export { Active } from "./Active.js";

export { Position } from "./Position.js";
export { Rotation } from "./Rotation.js";
export { Transform } from "./Transform.js";

export { Geometry } from "./Geometry.js";
export { GLTFModel } from "./GLTFModel.js";
export { TextGeometry } from "./TextGeometry.js";
export { VRController } from "./VRController.js";
export { Material } from "./Material.js";
export { Sky } from "./Sky.js";

export const Camera = createComponentClass(
  {
    fov: { default: 45 },
    aspect: { default: 1 },
    near: { default: 1 },
    far: { default: 1000 },
    layers: { default: 0 },
    handleResize: { default: true }
  },
  "Camera"
);

export const WebGLRenderer = createComponentClass(
  {
    vr: { default: true },
    antialias: { default: true },
    handleResize: { default: true }
  },
  "WebGLRenderer"
);

export class RenderableGroup {
  constructor() {
    this.scene = null;
    this.camera = null;
  }

  reset() {
    this.scene = null;
    this.camera = null;
  }
}
