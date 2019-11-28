import { System, Not } from "ecsy";
import { Parent, Object3D } from "../components/index.js";
import * as THREE from "three";

export class TransformSystem extends System {
  execute(delta) {
    // Hierarchy
    let added = this.queries.parent.added;
    for (var i = 0; i < added.length; i++) {
      var entity = added[i];
      console.log('Adding', i);
      var parentEntity = entity.getComponent(Parent).value;
      parentEntity.getComponent(Object3D).value.add(entity.getComponent(Object3D).value);
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
