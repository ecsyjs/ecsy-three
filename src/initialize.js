import { ECSYThreeWorld } from "./world.js";
import { WebGLRendererSystem } from "./systems/WebGLRendererSystem.js";
import { WebGLRendererComponent } from "./components/WebGLRendererComponent.js";
import { PerspectiveCamera, Scene, WebGLRenderer, Clock } from "three";

export function initialize(world, options = {}) {
  let { renderer, animationLoop } = options;

  if (!world) {
    world = new ECSYThreeWorld();
  }

  world
    .registerComponent(WebGLRendererComponent)
    .registerSystem(WebGLRendererSystem, { priority: 999 });

  if (!renderer) {
    renderer = new WebGLRenderer({
      antialias: true,
    });

    document.body.appendChild(renderer.domElement);
  }

  if (!animationLoop) {
    const clock = new Clock();
    animationLoop = () => {
      world.execute(clock.getDelta(), clock.elapsedTime);
    };
  }

  renderer.setAnimationLoop(animationLoop);

  const scene = new Scene();
  const sceneEntity = world.createEntity().addObject3DComponent(scene);

  const camera = new PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const cameraEntity = world
    .createEntity()
    .addObject3DComponent(camera, sceneEntity);

  const rendererEntity = world
    .createEntity()
    .addComponent(WebGLRendererComponent, {
      scene: sceneEntity,
      camera: cameraEntity,
      renderer: renderer,
    });

  return {
    world,
    camera,
    scene,
    renderer,
    sceneEntity,
    cameraEntity,
    rendererEntity,
  };
}
