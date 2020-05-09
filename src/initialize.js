import { Clock, WebGLRenderer as ThreeWebGLRenderer } from "three";
import { ThreeWorld } from "./ThreeWorld";
import { SceneEntity, PerspectiveCameraEntity } from "./entities/index.js";
import { WebGLRenderer } from "./components/WebGLRenderer.js";
import { WebGLRendererSystem } from "./systems/WebGLRendererSystem.js";

export function initialize(world = new ThreeWorld(), options) {
  options = Object.assign({}, options);

  world
    .registerComponent(WebGLRenderer, false)
    .registerEntityType(SceneEntity)
    .registerEntityType(PerspectiveCameraEntity, false)
    .registerSystem(WebGLRendererSystem, { priority: 1 });

  let animationLoop = options.animationLoop;

  if (!animationLoop) {
    const clock = new Clock();

    animationLoop = () => {
      world.execute(clock.getDelta(), clock.elapsedTime);
    };
  }

  const rendererOptions = Object.assign(
    {
      antialias: true
    },
    options.renderer
  );

  const renderer = new ThreeWebGLRenderer(rendererOptions);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setAnimationLoop(animationLoop);

  const canvas = options.renderer && options.renderer.canvas;
  const width = canvas ? canvas.parentElement.offsetWidth : window.innerWidth;
  const height = canvas
    ? canvas.parentElement.offsetHeight
    : window.innerHeight;

  renderer.setSize(width, height, !!canvas);

  if (!canvas) {
    document.body.appendChild(renderer.domElement);
  }

  let scene = world.addEntity(new SceneEntity(world));

  const camera = new PerspectiveCameraEntity(
    world,
    90,
    width / height,
    0.1,
    100
  );

  scene.add(camera);

  let rendererEntity = world.createEntity().addComponent(WebGLRenderer, {
    renderer,
    scene,
    camera,
    updateCanvasStyle: !!canvas
  });

  return {
    world,
    entities: {
      scene,
      camera,
      renderer: rendererEntity
    }
  };
}
