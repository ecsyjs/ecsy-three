import * as ECSY from "ecsy";
import * as THREE from "three";

// components
export {
  Active,
  Camera,
  CameraRig,
  Draggable,
  Dragging,
  Geometry,
  GLTFModel,
  Material,
  Object3D,
  Parent,
  Position,
  Rotation,
  RenderPass,
  Scene,
  Sky,
  SkyBox,
  TextGeometry,
  Transform,
  Visible,
  VRController
} from "./components/index.js";

// systems
export { GeometrySystem } from "./systems/GeometrySystem.js";
export { GLTFLoaderSystem } from "./systems/GLTFLoaderSystem.js";
export { SkyBoxSystem } from "./systems/SkyBoxSystem.js";
export { VisibilitySystem } from "./systems/VisibilitySystem.js";
export {
  WebGLRendererSystem,
  WebGLRendererContext
} from "./systems/WebGLRendererSystem.js";
export { TransformSystem } from "./systems/TransformSystem.js";
export { CameraSystem } from "./systems/CameraSystem.js";
export { TextGeometrySystem } from "./systems/TextGeometrySystem.js";

import { TransformSystem } from "./systems/TransformSystem.js";
import { CameraSystem } from "./systems/CameraSystem.js";
import { WebGLRendererSystem } from "./systems/WebGLRendererSystem.js";
import { Object3D } from "./components/Object3D.js";
import { CameraRig } from "./components/CameraRig.js";
import { Parent } from "./components/Parent.js";
import {
  WebGLRenderer,
  Scene,
  RenderPass,
  Camera
} from "./components/index.js";

export function init(world) {
  world
    .registerSystem(TransformSystem)
    .registerSystem(CameraSystem)
    .registerSystem(WebGLRendererSystem, { priority: 1 });
}

export function initializeDefault(world = new ECSY.World(), options) {
  const clock = new THREE.Clock();

  init(world);

  let scene = world
    .createEntity()
    .addComponent(Scene)
    .addComponent(Object3D, { value: new THREE.Scene() });

  let renderer = world.createEntity().addComponent(WebGLRenderer, {
    /*animationLoop: () => {
      world.execute(clock.getDelta(), clock.elapsedTime);
    }*/
  });

  // camera rig & controllers
  var camera = null,
    cameraRig = null;

  if (options.vr) {
    cameraRig = world
      .createEntity()
      .addComponent(CameraRig)
      .addComponent(Parent, { value: scene });
  } else {
    camera = world.createEntity().addComponent(Camera, {
      fov: 90,
      aspect: window.innerWidth / window.innerHeight,
      near: 1,
      far: 1000,
      layers: 1,
      handleResize: true
    });
  }

  let renderPass = world.createEntity().addComponent(RenderPass, {
    scene: scene,
    camera: camera
  });

  return {
    world,
    entities: {
      scene,
      camera,
      cameraRig,
      renderer,
      renderPass
    }
  };
}
