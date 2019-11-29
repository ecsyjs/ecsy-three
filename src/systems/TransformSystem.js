import { System } from "ecsy";
import { Parent, Object3D } from "../components/index.js";

export class TransformSystem extends System {
  execute() {
    // Hierarchy
    let added = this.queries.parent.added;
    for (var i = 0; i < added.length; i++) {
      var entity = added[i];
      var parentEntity = entity.getComponent(Parent).value;
      var parentObject3D = parentEntity.getComponent(Object3D).value;
      var childObject3D = entity.getComponent(Object3D).value;
      parentObject3D.add(childObject3D);
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
