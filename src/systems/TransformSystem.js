import { System, Not } from "../../ecsy.module.js";
import { Parent, Object3D } from "../components/index.js";
import * as THREE from "../../three.module.js";

export class TransformSystem extends System {
  execute(delta) {
    // Hierarchy
    let added = this.queries.parent.added;
    for (var i = 0; i < added.length; i++) {
      var entity = added[i];
      var parentEntity = entity.getComponent(Parent).parent;
      parentEntity.getComponent(Object3D).object.add(entity.getComponent(Object3D).object);
    }
  }
}

TransformSystem.queries = {
  parent: {
    components: [Parent, Object3D],
    listen: {
      added: true
    }
  }
};
