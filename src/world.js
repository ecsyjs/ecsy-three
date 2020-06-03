import { World } from "ecsy";
import { Object3DComponent } from "./components/index.js";
import {
  addObject3DComponents,
  removeObject3DComponents,
  getObject3D
} from "./entity-utils.js";

export class ECSYThreeWorld extends World {
  createEntity() {
    // We can pass arguments to createEntity as "name"
    const e = super.createEntity.apply(this, arguments);

    // TODO do this on the Entity prototype elsewhere instead
    e.addObject3DComponents = addObject3DComponents.bind(null, e);
    e.removeObject3DComponents = removeObject3DComponents.bind(null, e);
    e.getObject3D = getObject3D.bind(null, e);
    return e;
  }

  // TODO expose removeEntity on ECSY.World and change `this.entityManager` usage to `super``
  removeEntity(entity) {
    if (entity.hasComponent(Object3DComponent)) {
      const obj = entity.getComponent(Object3DComponent).value;
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
