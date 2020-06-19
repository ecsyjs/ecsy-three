import * as THREE from "three";

import { WebGLRendererSystem } from "./systems/WebGLRendererSystem.js";
import { UpdateAspectOnResizeSystem } from "./systems/UpdateAspectOnResizeSystem.js";
import {
  WebGLRenderer,
  Scene,
  Active,
  RenderPass,
  Object3DComponent,
  Camera,
  SceneTagComponent,
  CameraTagComponent,
  MeshTagComponent,
  UpdateAspectOnResizeTag
} from "./components/index.js";

import { ECSYThreeWorld } from "./world.js";

export function initialize(world = new ECSYThreeWorld(), options) {
  if (!(world instanceof ECSYThreeWorld)) {
    throw new Error(
      "The provided 'world' paremeter is not an instance of 'ECSYThreeWorld'"
    );
  }

  world
    .registerSystem(UpdateAspectOnResizeSystem)
    // .registerSystem(CameraSystem)

  world
    .registerComponent(WebGLRenderer)
    .registerComponent(Scene)
    .registerComponent(Active)
    .registerComponent(Object3DComponent)
    .registerComponent(RenderPass)
//    .registerComponent(Transform)
    .registerComponent(Camera)
    // Tags
    .registerComponent(SceneTagComponent)
    .registerComponent(CameraTagComponent)
    .registerComponent(MeshTagComponent)

    .registerComponent(UpdateAspectOnResizeTag)


  const DEFAULT_OPTIONS = {
    vr: false,
    defaults: true
  };

  options = Object.assign({}, DEFAULT_OPTIONS, options);

  if (!options.defaults) {
    return { world };
  }

  let animationLoop = options.animationLoop;
  if (!animationLoop) {
    const clock = new THREE.Clock();
    animationLoop = () => {
      world.execute(clock.getDelta(), clock.elapsedTime);
    };
  }

  let scene = world
    .createEntity()
    .addComponent(Scene)
    .addObject3DComponent(new THREE.Scene());

  let renderer = world.createEntity().addComponent(WebGLRenderer, {
    ar: options.ar,
    vr: options.vr,
    animationLoop: animationLoop
  });

  // camera rig & controllers
  var camera = null,
    cameraRig = null;

  // if (options.ar || options.vr) {
  //   cameraRig = world
  //     .createEntity()
  //     .addComponent(CameraRig)
  //     .addComponent(Parent, { value: scene });
  // }

  {
    camera = world
      .createEntity()
      .addComponent(Camera)
      .addComponent(UpdateAspectOnResizeTag)
      .addObject3DComponent(
        new THREE.PerspectiveCamera(
          90,
          window.innerWidth / window.innerHeight,
          0.1,
          100
        ),
        scene
      )
      .addComponent(Active);
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
