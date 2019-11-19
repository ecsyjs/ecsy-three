import { World } from "../ecsy.module.js";

// components
export { SkyBox } from "./components/Skybox.js";
export { Object3D } from "./components/Object3D.js";
export { Scene, Camera, Parent } from "./components/index.js";

// systems
export { SkyBoxSystem } from "./systems/SkyboxSystem.js";
export { WebGLRendererSystem } from "./systems/WebGLRendererSystem.js";
export { TransformSystem } from "./systems/TransformSystem.js";

export function init(world) {
  world.registerSystem(SkyBoxSystem);
  world.registerSystem(TransformSystem);
  world.registerSystem(WebGLRendererSystem); // @todo Add priority
}

export function initializeDefault(world = new World()) {
  init(world);

  let camera = world.createEntity().addComponent(Camera);
  let scene = world.createEntity().addComponent(Scene);
  let renderer = world.createEntity().addComponent(renderer);

  return {
    world,
    scene,
    camera,
    renderer
  };
}