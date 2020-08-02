import { Component, System, Types } from "https://unpkg.com/ecsy@0.3.2?module";
import { initialize, Object3DComponent } from "https://unpkg.com/ecsy-three@0.1.0/extras?module";
import {
  Mesh,
  BoxBufferGeometry,
  MeshBasicMaterial,
  TextureLoader
} from "https://unpkg.com/three@0.119.1?module";

class Rotating extends Component {
  static schema = {
    speed: { default: 1, type: Types.Number }
  };
}

class RotationSystem extends System {
  static queries = {
    entities: {
      components: [Rotating, Object3DComponent]
    }
  };

  execute(delta) {
    this.queries.entities.results.forEach(entity => {
      var rotation = entity.getObject3D().rotation;
      rotation.x += 0.5 * delta;
      rotation.y += 0.1 * delta;
    });
  }
}

// Initialize the default sets of entities and systems
const { world, sceneEntity, camera } = initialize();

world
  .registerComponent(Rotating)

world
  .registerSystem(RotationSystem);

// Modify the position for the default camera
camera.position.z = 2;

const mesh = new Mesh(
  new BoxBufferGeometry(),
  new MeshBasicMaterial({
    map: new TextureLoader().load("./textures/crate.gif")
  })
);

world
  .createEntity()
  .addComponent(Rotating)
  .addObject3DComponent(mesh, sceneEntity);  