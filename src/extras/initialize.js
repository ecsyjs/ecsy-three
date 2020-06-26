import * as THREE from "/web_modules/three.js";
import {WebGLRendererSystem as WebGLRendererSystem2} from "./systems/WebGLRendererSystem.js";
import {TransformSystem as TransformSystem2} from "./systems/TransformSystem.js";
import {UpdateAspectOnResizeSystem as UpdateAspectOnResizeSystem2} from "./systems/UpdateAspectOnResizeSystem.js";
import {OnObject3DAddedSystem as OnObject3DAddedSystem2} from "./systems/OnObject3DAddedSystem.js";
import {WebGLRenderer, Scene, Active, RenderPass, Camera, CameraRig, Parent, UpdateAspectOnResizeTag, OnObject3DAdded} from "./components/index.js";
import {Object3DComponent, SceneTagComponent, CameraTagComponent, MeshTagComponent} from "../core/components.js";
import {ECSYThreeWorld} from "../core/world.js";
export function initialize(world2 = new ECSYThreeWorld(), options) {
  if (!(world2 instanceof ECSYThreeWorld)) {
    throw new Error("The provided 'world' paremeter is not an instance of 'ECSYThreeWorld'");
  }
  world2.registerSystem(UpdateAspectOnResizeSystem2).registerSystem(TransformSystem2).registerSystem(OnObject3DAddedSystem2).registerSystem(WebGLRendererSystem2);
  world2.registerComponent(OnObject3DAdded).registerComponent(WebGLRenderer).registerComponent(Scene).registerComponent(Active).registerComponent(CameraRig).registerComponent(Parent).registerComponent(Object3DComponent).registerComponent(RenderPass).registerComponent(Camera).registerComponent(SceneTagComponent).registerComponent(CameraTagComponent).registerComponent(MeshTagComponent).registerComponent(UpdateAspectOnResizeTag);
  const DEFAULT_OPTIONS = {
    vr: false,
    defaults: true
  };
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  if (!options.defaults) {
    return {
      world: world2
    };
  }
  let animationLoop = options.animationLoop;
  if (!animationLoop) {
    const clock = new THREE.Clock();
    animationLoop = () => {
      world2.execute(clock.getDelta(), clock.elapsedTime);
    };
  }
  let scene = world2.createEntity().addComponent(Scene).addObject3DComponent(new THREE.Scene());
  let renderer = world2.createEntity().addComponent(WebGLRenderer, {
    ar: options.ar,
    vr: options.vr,
    animationLoop
  });
  var camera = null, cameraRig = null;
  if (options.ar || options.vr) {
    cameraRig = world2.createEntity().addComponent(CameraRig).addComponent(Parent, {
      value: scene
    }).addComponent(Active);
  } else {
    camera = world2.createEntity().addComponent(Camera).addComponent(UpdateAspectOnResizeTag).addObject3DComponent(new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100), scene).addComponent(Active);
  }
  let renderPass = world2.createEntity().addComponent(RenderPass, {
    scene,
    camera
  });
  return {
    world: world2,
    entities: {
      scene,
      camera,
      cameraRig,
      renderer,
      renderPass
    }
  };
}
