import {Component, System} from "/web_modules/ecsy.js";
import {ECSYThreeWorld, Object3DComponent, Types} from "/src/index.js";
import {initialize, GLTFLoader, GLTFLoaderSystem, Position} from "/src/extras/index.js";
import {AmbientLight, Mesh, BoxBufferGeometry, MeshBasicMaterial, TextureLoader, Vector3} from "/web_modules/three.js";
class Rotating extends Component {
}
Rotating.schema = {
  speed: {
    default: 1,
    type: Types.Number
  }
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
    components: [Rotating, Object3DComponent]
  }
};
var world;
init();
function init() {
  world = new ECSYThreeWorld();
  let data = initialize(world);
  world.registerComponent(Position).registerComponent(Rotating).registerComponent(GLTFLoader);
  world.registerSystem(GLTFLoaderSystem);
  world.registerSystem(RotationSystem);
  let {scene, camera} = data.entities;
  let camera3d = camera.getObject3D();
  camera3d.position.z = 5;
  world.createEntity().addObject3DComponent(new AmbientLight(), scene);
  var rotatingBox = world.createEntity().addComponent(Rotating).addObject3DComponent(new Mesh(new BoxBufferGeometry(20, 20, 20), new MeshBasicMaterial({
    map: new TextureLoader().load("./textures/crate.gif")
  })), scene);
  rotatingBox.remove();
  world.createEntity().addComponent(Position, {
    value: new Vector3(-2, 0, 0)
  }).addComponent(Rotating).addObject3DComponent(new Mesh(new BoxBufferGeometry(1, 1, 1), new MeshBasicMaterial({
    map: new TextureLoader().load("./textures/crate.gif")
  })), scene);
  world.createEntity().addComponent(Position, {
    value: new Vector3(2, 0, 0)
  }).addComponent(Rotating, {
    speed: -2
  }).addComponent(GLTFLoader, {
    url: "./models/Duck.glb",
    parent: scene
  });
  world.execute();
}
