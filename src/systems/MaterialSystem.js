import * as THREE from "three";
import { System, Not, SystemStateComponent } from "ecsy";
import {
  Material,
  Object3DComponent,
  Transform,
  //  Element,
  //  Draggable,
  Parent
} from "../components/index.js";

class MaterialInstance extends SystemStateComponent {
  constructor() {
    super();
    this.value = new THREE.MeshStandardMaterial();
  }

  reset() {}
}

export class MaterialSystem extends System {
  execute() {
    this.queries.new.results.forEach(entity => {
      const component = entity.getComponent(Material);
    });
  }
}

MaterialSystem.queries = {
  new: {
    components: [Material, Not(MaterialInstance)]
  }
};
