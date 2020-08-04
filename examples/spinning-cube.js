import { Component, System, Types } from "ecsy";
import { initialize, Object3DComponent } from "ecsy-three";
import {
  Mesh,
  BoxBufferGeometry,
  MeshBasicMaterial,
  TextureLoader,
} from "three";

class Rotating extends Component {}
Rotating.schema = {
  speed: { default: 1, type: Types.Number },
};

class RotationSystem extends System {
  execute(delta) {
    this.queries.entities.results.forEach((entity) => {
      var rotation = entity.getObject3D().rotation;
      rotation.x += 0.5 * delta;
      rotation.y += 0.1 * delta;
    });
  }
}

RotationSystem.queries = {
  entities: {
    components: [Rotating, Object3DComponent],
  },
};

// Initialize the default sets of entities and systems
const { world, sceneEntity, camera } = initialize();

world.registerComponent(Rotating);

world.registerSystem(RotationSystem);

// Modify the position for the default camera
camera.position.z = 2;

const mesh = new Mesh(
  new BoxBufferGeometry(),
  new MeshBasicMaterial({
    map: new TextureLoader().load("./textures/crate.gif"),
  })
);

world
  .createEntity()
  .addComponent(Rotating)
  .addObject3DComponent(mesh, sceneEntity);
