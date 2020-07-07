import { Component, System } from "ecsy";
import { ECSYThreeWorld, Object3DComponent, Types } from "/src/index.js";
import {
  initialize,
  // Components
  GLTFLoader,
  // Systems
  GLTFLoaderSystem,
  Position
} from "/src/extras/index.js";
import {
  AmbientLight,
  Mesh,
  BoxBufferGeometry,
  MeshBasicMaterial,
  TextureLoader,
  Vector3
} from "three";

class Rotating extends Component {}
Rotating.schema = {
  speed: { default: 1, type: Types.Number }
};

class RotationSystem extends System {
  execute(delta) {
    this.queries.entities.results.forEach(entity => {
      var rotation = entity.getObject3D().rotation;
      rotation.x += 0.5 * delta;
      rotation.y += 0.1 * delta;
    });
  }
}

RotationSystem.queries = {
  entities: {
    components: [Rotating, Object3DComponent]
  }
};

var world;

init();

function init() {
  // Create a new world to hold all our entities and systems
  world = new ECSYThreeWorld();

  // Initialize the default sets of entities and systems
  let data = initialize(world);

  world
    .registerComponent(Position)
    .registerComponent(Rotating)
    .registerComponent(GLTFLoader);

  world.registerSystem(GLTFLoaderSystem);
  // Register our custom sytem
  world.registerSystem(RotationSystem);

  // Grab the initialized entities
  let { scene, camera } = data.entities;

  // Modify the position for the default camera
  let camera3d = camera.getObject3D();
  camera3d.position.z = 5;

  world.createEntity().addObject3DComponent(new AmbientLight(), scene);

  // Create an entity to handle our rotating box
  var rotatingBox = world
    .createEntity()
    .addComponent(Rotating)
    .addObject3DComponent(
      new Mesh(
        new BoxBufferGeometry(20, 20, 20),
        new MeshBasicMaterial({
          map: new TextureLoader().load("./textures/crate.gif")
        })
      ),
      scene
    );
  rotatingBox.remove();
  // rotatingBox should no longer be in the world or the threejs sceen

  world
    .createEntity()
    .addComponent(Position, { value: new Vector3(-2, 0, 0) })
    .addComponent(Rotating)
    .addObject3DComponent(
      new Mesh(
        new BoxBufferGeometry(1, 1, 1),
        new MeshBasicMaterial({
          map: new TextureLoader().load("./textures/crate.gif")
        })
      ),
      scene
    );

  /* Snowpack not working properly with binary requests
  world
    .createEntity()
    .addComponent(Position, { value: new Vector3(2, 0, 0) })
    .addComponent(Rotating, { speed: -2 })
    .addComponent(GLTFLoader, {
      url: "./models/Duck.glb",
      parent: scene
    });
  */

  // Let's begin
  world.execute();
}
