import {_Entity} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
import {Object3DComponent as Object3DComponent2} from "./Object3DComponent.js";
export class ECSYThreeEntity extends _Entity {
  addObject3DComponent(obj, parentEntity) {
    obj.entity = this;
    this.addComponent(Object3DComponent2, {
      value: obj
    });
    this._entityManager.world.object3DInflator.inflate(this, obj);
    if (parentEntity && parentEntity.hasComponent(Object3DComponent2)) {
      parentEntity.getObject3D().add(obj);
    }
    return this;
  }
  removeObject3DComponent(unparent = true) {
    const obj = this.getComponent(Object3DComponent2, true).value;
    if (unparent) {
      obj.parent && obj.parent.remove(obj);
    }
    this.removeComponent(Object3DComponent2);
    this._entityManager.world.object3DInflator.deflate(this, obj);
    obj.entity = null;
  }
  remove(forceImmediate) {
    if (this.hasComponent(Object3DComponent2)) {
      const obj = this.getObject3D();
      obj.traverse((o) => {
        if (o.entity) {
          this._entityManager.removeEntity(o.entity, forceImmediate);
        }
        o.entity = null;
      });
      obj.parent && obj.parent.remove(obj);
    }
    this._entityManager.removeEntity(this, forceImmediate);
  }
  getObject3D() {
    return this.getComponent(Object3DComponent2).value;
  }
}
