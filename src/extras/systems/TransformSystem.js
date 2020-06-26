import {System} from "/web_modules/ecsy.js";
import {ParentObject3D, Transform, Position, Scale, Parent} from "../components/index.js";
import {Object3DComponent} from "../../core/components.js";
export class TransformSystem extends System {
  execute() {
    let added = this.queries.parent.added;
    for (var i = 0; i < added.length; i++) {
      var entity = added[i];
      if (!entity.alive) {
        return;
      }
      var parentEntity = entity.getComponent(Parent).value;
      if (parentEntity.hasComponent(Object3DComponent)) {
        var parentObject3D = parentEntity.getObject3D();
        var childObject3D = entity.getObject3D();
        parentObject3D.add(childObject3D);
      }
    }
    this.queries.parentObject3D.added.forEach((entity2) => {
      var parentObject3D2 = entity2.getComponent(ParentObject3D).value;
      var childObject3D2 = entity2.getObject3D();
      parentObject3D2.add(childObject3D2);
    });
    var transforms = this.queries.transforms;
    for (let i2 = 0; i2 < transforms.added.length; i2++) {
      let entity2 = transforms.added[i2];
      let transform = entity2.getComponent(Transform);
      let object = entity2.getObject3D();
      object.position.copy(transform.position);
      object.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
    }
    for (let i2 = 0; i2 < transforms.changed.length; i2++) {
      let entity2 = transforms.changed[i2];
      if (!entity2.alive) {
        continue;
      }
      let transform = entity2.getComponent(Transform);
      let object = entity2.getObject3D();
      object.position.copy(transform.position);
      object.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
    }
    let positions = this.queries.positions;
    for (let i2 = 0; i2 < positions.added.length; i2++) {
      let entity2 = positions.added[i2];
      let position = entity2.getComponent(Position).value;
      let object = entity2.getObject3D();
      object.position.copy(position);
      entity2.getComponent(Position).value = object.position;
    }
    let scales = this.queries.scales;
    for (let i2 = 0; i2 < scales.added.length; i2++) {
      let entity2 = scales.added[i2];
      let scale = entity2.getComponent(Scale).value;
      let object = entity2.getObject3D();
      object.scale.copy(scale);
    }
    for (let i2 = 0; i2 < scales.changed.length; i2++) {
      let entity2 = scales.changed[i2];
      let scale = entity2.getComponent(Scale).value;
      let object = entity2.getObject3D();
      object.scale.copy(scale);
    }
  }
}
TransformSystem.queries = {
  parentObject3D: {
    components: [ParentObject3D, Object3DComponent],
    listen: {
      added: true
    }
  },
  parent: {
    components: [Parent, Object3DComponent],
    listen: {
      added: true
    }
  },
  transforms: {
    components: [Object3DComponent, Transform],
    listen: {
      added: true,
      changed: [Transform]
    }
  },
  positions: {
    components: [Object3DComponent, Position],
    listen: {
      added: true,
      changed: [Position]
    }
  },
  scales: {
    components: [Object3DComponent, Scale],
    listen: {
      added: true,
      changed: [Scale]
    }
  }
};
