import { createComponentClass } from "ecsy";
export { SkyBox } from "./Skybox.js";
export { Object3D } from "./Object3D.js";
export { Scene } from "./Scene.js";

export class Parent {
  constructor() {
    this.parent = null;
  }

  reset() {
    this.parent = null;
  }
}

export const Camera = createComponentClass({
  fov: { default: 45 },
  aspect: { default: 1 },
  near: { default: 1 },
  far: { default: 1000 },
  layers: { default: 0 },
  handleResize: { default: true }
}, "Camera");


export const WebGLRenderer = createComponentClass({
  vr: { default: true },
  antialias: {default: true},
  handleResize: { default: true }
}, "WebGLRenderer");

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