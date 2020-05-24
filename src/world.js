import { World } from "ecsy";
import { Object3D } from "./components/index.js";
import {
  addObject3DComponents,
  removeObject3DComponents
} from "./entity-utils.js";

export class ECSYThreeWorld extends World {
  createEntity() {
    const e = super.createEntity();
    // TODO do this on the Entity prototype elsewhere instead
    e.addObject3DComponents = addObject3DComponents.bind(null, e);
    e.removeObject3DComponents = removeObject3DComponents.bind(null, e);
    return e;
  }

  // TODO expose removeEntity on ECSY.World and change `this.entityManager` usage to `super``
  removeEntity(entity) {
    if (entity.hasComponent(Object3D)) {
      const obj = entity.getComponent(Object3D).value;
      obj.traverse(o => {
        this.entityManager.removeEntity(o.entity);
        o.entity = null;
      });
      obj.parent && obj.parent.remove(obj);
    } else {
      this.entityManager.removeEntity(entity);
    }
  }
}
