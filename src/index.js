import * as ECSY from "ecsy";
import * as THREE from "three";

export * as ECSY from "ecsy";
export * as THREE from "three";

// components
export { SkyBox } from "./components/Skybox.js";
export { Object3D } from "./components/Object3D.js";
export { Scene, Camera, Parent } from "./components/index.js";

// systems
export { SkyBoxSystem } from "./systems/SkyBoxSystem.js";
export { WebGLRendererSystem } from "./systems/WebGLRendererSystem.js";
export { TransformSystem } from "./systems/TransformSystem.js";
export { CameraSystem } from "./systems/CameraSystem.js";

import { TransformSystem } from "./systems/TransformSystem.js";
import { CameraSystem } from "./systems/CameraSystem.js";
import { WebGLRendererSystem } from "./systems/WebGLRendererSystem.js";
import { Object3D } from "./components/Object3D.js";
import { WebGLRenderer, RenderableGroup, Camera } from "./components/index.js";

export function init(world) {
  world
    .registerSystem(TransformSystem)
    .registerSystem(CameraSystem)
    .registerSystem(WebGLRendererSystem, {priority: 1});
}

export function initializeDefault(world = new ECSY.World()) {
  init(world);

  let scene = world.createEntity().addComponent(Object3D /* Scene */, {value: new THREE.Scene()});
  let renderer = world.createEntity().addComponent(WebGLRenderer);
  let camera = world.createEntity().addComponent(Camera, {
    fov: 90,
    aspect: window.innerWidth / window.innerHeight,
    near: 1,
    far: 1000,
    layers: 1,
    handleResize: true
  });

  let renderables = world.createEntity().addComponent(RenderableGroup, {
    scene: scene,
    camera: camera
  });

  return {
    world,
    entities: {
      scene,
      camera,
      renderer,
      renderables
    }
  };
}