import { World } from "ecsy";
import { ECSYThreeEntity } from "./entity.js";
import { Object3DComponent } from "./components/index.js";

export class ECSYThreeWorld extends World {
  constructor(options) {
    super(Object.assign({}, { entityClass: ECSYThreeEntity }, options));
  }

  // TODO expose removeEntity on ECSY.World and change `this.entityManager` usage to `super``
  removeEntity(entity) {
    if (entity.hasComponent(Object3DComponent)) {
      const obj = entity.getObject3D();
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
