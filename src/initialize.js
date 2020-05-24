import * as THREE from "three";

import { WebGLRendererSystem } from "./systems/WebGLRendererSystem.js";
<<<<<<< HEAD
import { UpdateAspectOnResizeSystem } from "./systems/UpdateAspectOnResizeSystem.js";
=======
>>>>>>> Simplest possible example using proposed API
import {
  WebGLRenderer,
  Scene,
  Active,
  RenderPass,
<<<<<<< HEAD
  Camera,
  UpdateAspectOnResizeTag
=======
  Camera
>>>>>>> Simplest possible example using proposed API
} from "./components/index.js";

import { ECSYThreeWorld } from "./world.js";

export function initialize(world = new ECSYThreeWorld(), options) {
<<<<<<< HEAD
  if (!(world instanceof ECSYThreeWorld)) {
    throw new Error(
      "The provided 'world' paremeter is not an instance of 'ECSYThreeWorld'"
    );
  }

  world
    .registerSystem(UpdateAspectOnResizeSystem)
=======
  world
    // .registerSystem(CameraSystem)
>>>>>>> Simplest possible example using proposed API
    .registerSystem(WebGLRendererSystem, { priority: 1 });

  world
    .registerComponent(WebGLRenderer)
    .registerComponent(Scene)
    .registerComponent(Active)
    .registerComponent(RenderPass)
    .registerComponent(Transform)
    .registerComponent(Camera);

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
<<<<<<< HEAD
    .addObject3DComponent(new THREE.Scene());
=======
    .addObject3DComponents(new THREE.Scene());
>>>>>>> Simplest possible example using proposed API

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
<<<<<<< HEAD
      .addComponent(UpdateAspectOnResizeTag)
      .addObject3DComponent(
=======
      .addObject3DComponents(
>>>>>>> Simplest possible example using proposed API
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
